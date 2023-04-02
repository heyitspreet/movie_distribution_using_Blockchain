import hashlib
import cv2
import sys

def embed_string_in_video(video_path, hidden_string, output_path):
    # Read the video
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Could not open video file")
        return
    
    Secret = "Secret Message"
    hidden_string = Secret + hidden_string
    hash_object = hashlib.sha256(hidden_string.encode())
    hash_string = hash_object.hexdigest()
    #Signing the hidden string using Secret msg
    
    #hidden_string =Hash(Secret + hidden_string)

    # Get the video properties
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_size = (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))

    # Convert the hidden string to binary
    # hidden_string = ''.join(format(ord(i), '08b') for i in hidden_string)

    # Initialize the video writer
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, frame_size)

    # Embed the hidden string in each frame
    while True:
        # Read the next frame
        ret, frame = cap.read()
        if not ret:
            break

        # Embed one bit of the hidden string in each pixel's red channel
        for y in range(frame_size[1]):
            for x in range(frame_size[0]):
                pixel = list(frame[y, x])
                if len(hash_string) > 0:
                    pixel[2] = (pixel[2] & 254) | int(hash_string[0], 16) & 1
                    hash_string = hash_string[1:]
                else:
                    break
            if len(hash_string) == 0:
                break
            
        out.write(frame)

    cap.release()
    out.release()

def extract_string_from_video(video_path):
    # Read the video
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Could not open video file")
        return

    # Get the video properties
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_size = (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))

    # Initialize the hidden string
    hidden_string = ''

    # Extract the hidden string from each frame
    while True:
        # Read the next frame
        ret, frame = cap.read()
        if not ret:
            break

        # Extract one bit of the hidden string from each pixel's red channel
        for y in range(frame_size[1]):
            for x in range(frame_size[0]):
                pixel = list(frame[y, x])
                hidden_string += str(pixel[2] & 1)

    # Convert the binary string to ASCII
    n = int(hidden_string, 2)
    hidden_string = n.to_bytes((n.bit_length() + 7) // 8, 'big').decode()

    cap.release()

    return hidden_string

if __name__ == '__main__':
    #print opencv version
    print(cv2.__version__)
    # Embed a hidden string in a video
    embed_string_in_video('.\\video.mp4', 'Sad_Cow', 'video_embedded.mp4')
    # print the hash of the video file
    print(hashlib.md5(open('video_embedded.mp4', 'rb').read()).hexdigest())
    # Extract the hidden string from a video
    print(extract_string_from_video('video_embedded.mp4'))

