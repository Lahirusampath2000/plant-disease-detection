import tensorflow as tf
import numpy as np

def model_prediction(test_image):
    model=tf.keras.models.load_model('model.h5')
    image=tf.keras.preprocessing.image.load_img(image_path, target_size=(128, 128))
    input_arr = tf.keras.preprocessing.image.img_to_array(image)
    input_arr = np.array([input_arr]) 
    prediction = model.predict(input_arr)
    result_index = np.argmax(prediction)
    return result_index