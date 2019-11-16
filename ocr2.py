import cv2
import sys
import pytesseract

def take_question(imPath):
  fin = open('coord.txt', 'r')
  lines_list = fin.readlines()
  for line in lines_list:
    coord = line.split(' ')
    x = int(coord[0]) + 1
    imPath = imPath + x + ".jpg"
    xref11 = coord[1]
    yref11 = coord[2]
    xref21 = coord[3]
    yref21 = coord[4]
    ml(xref21, xref11, yref11, yref21, imPath)
  
  fin.close()
def ml(xref21, xref11, yref11, yref21, imPath):

  # Read image path from command line
  # Uncomment the line below to provide path to tesseract manually
  # pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'
  take_question() 
   # Define config parameters.
  # '-l eng'  for using the English language
  # '--oem 1' for using LSTM OCR Engine
  config = ('--dpi 200 -l eng --oem 0 --psm 10 -c tessedit_char_whitelist=TF')
 
  # Read image from disk
  im = cv2.imread(imPath, cv2.IMREAD_GRAYSCALE)
  #cv2.imshow("cro", im)
  #cv2.waitKey(0)
  im2 = im[int(yref11):int(yref21), int(xref11):int(xref21)]
  #im2 = im[118 285 190 315 ]
  #im2 = im[290:310, 118:190]
  #cv2.imwrite("tes232.jpg", im2)
  cv2.imshow("cropped", im2)
  #cv2.waitKey(0)
  # Run tesseract OCR on image
  text = pytesseract.image_to_string(im2, config=config)
 
  # Print recognized text
  print(text)

if __name__ == '__main__':
  imPath = sys.argv[1]
  take_question(imPath)
  