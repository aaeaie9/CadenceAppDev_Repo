from flask import Flask, request, jsonify
import json
import os
import numpy as np
import soundfile as sf
from aubio import source, pitch

app = Flask(__name__)

# Path to the data.json file
data_json_path = './pitch/data.json'

# Ensure the pitch directory exists
os.makedirs('./pitch', exist_ok=True)

# Function to detect pitch in an audio file
def detect_pitch(file_path):
    # Set parameters
    win_s = 4096  # Window size
    hop_s = win_s // 2  # Hop size
    samplerate = 44100  # Sample rate

    # Create pitch detection object (YIN method)
    pitch_o = aubio.pitch("yin", win_s, hop_s, samplerate)
    pitch_o.set_unit("midi")  # Set output to MIDI

    # Read the audio file
    audio_data, sr = sf.read(file_path)

    if sr != samplerate:
        raise ValueError(f"Sample rate of audio file ({sr}) does not match the expected rate ({samplerate})")

    # Initialize pitch list
    pitch_data = []

    # Process audio data
    last_pitch_val = None  # To keep track of the last detected pitch
    note_start_time = None  # To keep track of when the note starts
    note_end_time = None  # To keep track of when the note ends

    for i in range(0, len(audio_data), hop_s):
        samples = audio_data[i:i + hop_s]
        if len(samples) < hop_s:
            continue

        if samples.ndim > 1:
            samples = samples[:, 0]  # Use the first channel if stereo
        samples = samples.astype(np.float32)

        pitch_val = pitch_o(samples)[0]  # Get pitch in MIDI
        timestamp = i / samplerate  # Timestamp in seconds

        if pitch_val > 0:  # If a pitch is detected
            if pitch_val != last_pitch_val:
                if last_pitch_val is not None and note_start_time is not None:
                    # Record the previous note with its duration
                    if note_end_time is not None:
                        pitch_data.append({
                            "midi": int(last_pitch_val),
                            "time": note_start_time,
                            "duration": note_end_time - note_start_time
                        })
                    else:
                        # If the note end time is still None, set it to the current timestamp
                        pitch_data.append({
                            "midi": int(last_pitch_val),
                            "time": note_start_time,
                            "duration": timestamp - note_start_time
                        })
                # Start a new note
                note_start_time = timestamp

            # Update last values
            last_pitch_val = pitch_val
            note_end_time = None  # Reset note end time as a new note is detected

        else:
            # If pitch is lost and a previous pitch existed, record the note duration
            if last_pitch_val is not None and note_start_time is not None:
                note_end_time = timestamp
                pitch_data.append({
                    "midi": int(last_pitch_val),
                    "time": note_start_time,
                    "duration": note_end_time - note_start_time
                })
                last_pitch_val = None  # Reset for next note
                note_start_time = None

    # Handle the last note (if it wasn't appended)
    if last_pitch_val is not None and note_start_time is not None:
        if note_end_time is None:
            note_end_time = timestamp  # End time is the last timestamp processed
        pitch_data.append({
            "midi": int(last_pitch_val),
            "time": note_start_time,
            "duration": note_end_time - note_start_time
        })

    # Combine consecutive identical notes and add durations
    combined_pitch_data = []
    previous_note = None

    for note in pitch_data:
        if previous_note and previous_note["midi"] == note["midi"]:
            # If the same note, combine durations
            previous_note["duration"] += note["duration"]
        else:
            # If a new note, push the previous note and start a new one
            if previous_note:
                combined_pitch_data.append(previous_note)
            previous_note = note

    # Add the last note if it exists
    if previous_note:
        combined_pitch_data.append(previous_note)

    # Round the durations and times to 1 decimal place after combining durations
    for note in combined_pitch_data:
        note["time"] = round(note["time"], 1)  # Round the time
        note["duration"] = round(note["duration"], 1)  # Round the duration

    return combined_pitch_data

@app.route('/upload-audio', methods=['POST'])
def upload_audio():
    username = request.form.get('username')
    title = request.form.get('title')
    audio_file = request.files.get('audio')

    if not username or not title or not audio_file:
        return jsonify({"message": "Missing username, title, or audio file"}), 400

    # Save the audio file in the pitch folder
    audio_file_path = os.path.join('./pitch', audio_file.filename)
    audio_file.save(audio_file_path)

    # Read the existing data.json file
    try:
        with open(data_json_path, 'r') as file:
            data = json.load(file)
    except FileNotFoundError:
        data = {}

    # Detect pitches from the uploaded audio file
    try:
        detected_pitches = detect_pitch(audio_file_path)
    except Exception as e:
        return jsonify({"message": f"Error detecting pitch: {str(e)}"}), 500

    # Add the new transcription under the username
    new_transcription = {
        "title": title,
        "audio_title": audio_file.filename,
        "notes": detected_pitches
    }

    if username not in data:
        data[username] = []
    data[username].append(new_transcription)

    # Write the updated data back to the data.json file
    with open(data_json_path, 'w') as file:
        json.dump(data, file, indent=2)

    return jsonify({
        "message": "Audio uploaded, pitch detected, and transcription data saved!",
        "transcription": new_transcription
    })

@app.route('/transcriptions', methods=['GET'])
def get_transcriptions():
    try:
        # Handle missing file gracefully by returning an empty dictionary
        if not os.path.exists(data_json_path):
            return jsonify({}), 200
        with open(data_json_path, 'r') as file:
            data = json.load(file)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"message": f"Error fetching transcriptions: {str(e)}"}), 500

@app.route('/transcriptions/<username>/<audio_title>', methods=['DELETE'])
def delete_transcription(username, audio_title):
    try:
        # Read the existing data.json file
        with open(data_json_path, 'r') as file:
            data = json.load(file)

        # Check if the username exists
        if username not in data:
            return jsonify({"message": "Username not found"}), 404

        # Find the transcription to delete
        user_transcriptions = data[username]
        transcription_to_delete = next((t for t in user_transcriptions if t['audio_title'] == audio_title), None)

        if not transcription_to_delete:
            return jsonify({"message": "Transcription not found"}), 404

        # Remove the transcription from the user's list
        data[username] = [t for t in user_transcriptions if t['audio_title'] != audio_title]

        # If the user has no remaining transcriptions, remove the username key
        if not data[username]:
            del data[username]

        # Write the updated data back to data.json
        with open(data_json_path, 'w') as file:
            json.dump(data, file, indent=2)

        # Delete the audio file from the file system
        audio_file_path = os.path.join('./pitch', audio_title)
        if os.path.exists(audio_file_path):
            os.remove(audio_file_path)

        return jsonify({"message": "Transcription and associated audio file deleted successfully"}), 200
    except Exception as e:
        return jsonify({"message": f"Error deleting transcription: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
