import cv2
import sys
import pytesseract

def take_question(imPath):
  score = 0
  q = 0
  fin = open('coord.txt', 'r')
  ansfin = open('answerkey.txt', 'r')
  ansar = ansfin.read().split(' ')
  lines_list = fin.readlines()
  for line in lines_list:
    coord = line.split(' ')
    if "" == line :
      break
     #print(line)
    x = int(coord[0]) + 1
    imPathnew = imPath + str(x) + ".jpg"
    xref11 = coord[1]
    yref11 = coord[2]
    xref21 = coord[3]
    yref21 = coord[4]
    evalans = ml(xref21, xref11, yref11, yref21, imPathnew)
    print('Answer Key :' + ansar[q] + ' Evaluated Answer: ' + evalans)
    if ansar[q] == evalans:
        score = score + 1
    q = q + 1
  fin.close()
  ansfin.close()
  return score
def ml(xref21, xref11, yref11, yref21, path2):

  # Read image path from command line
  # Uncomment the line below to provide path to tesseract manually
  # pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'
   # Define config parameters.
  # '-l eng'  for using the English language
  # '--oem 1' for using LSTM OCR Engine
  config = ('--dpi 200 -l eng --oem 2 --psm 10 -c tessedit_char_whitelist=TF')
 
  # Read image from disk
  im = cv2.imread(path2, cv2.IMREAD_GRAYSCALE)
  if im is None:
    return
  #cv2.imshow("cro", im)
  #cv2.waitKey(0)
  im2 = im[int(yref11):int(yref21), int(xref11):int(xref21)]
  retval, im3 = cv2.threshold(im2, 140, 255, cv2.THRESH_BINARY)

  #im2 = im[118 285 190 315 ]
  #im2 = im[290:310, 118:190]
  #cv2.imwrite("tes232.jpg", im2)
  #cv2.imshow("cropped", im3)
  #cv2.waitKey(0)
  # Run tesseract OCR on image
  text = pytesseract.image_to_string(im2, config=config)
  corrected = pytesseract.image_to_string(im3, config=config)
  # Print recognized text
  #print(imPath)
  return corrected
if __name__ == "__main__":
  imPath = sys.argv[1]
  print(take_question(imPath))
  