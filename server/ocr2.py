import cv2
import sys
import pytesseract
import numpy as np

index = sys.argv[2]

def bubble(img,i, j):
	total = 0
	dots = 0
	size = 10
	for x in range(i-size,i+size):
		for y in range(j-size,j+size):
			k = img[y, x]
			#print(str(k)+' ')
			total = total + 1
			if k < 170:
				dots =  dots + 1
	#print(str(dots)+ ' ' + str(total))
	#print(str(dots/total))
	if dots/total > 0.8:
		return 1
	else:
		return 0
def multiplechoice(x1, y1, x2 , y2, path3):
	im = cv2.imread(path3, cv2.IMREAD_GRAYSCALE)
	x1 -=10 
	y1 -=10
	x2 +=10 
	y2 +=10

	if im is None:
		return
	delta = int((int(y2) - int(y1)) / 3)
	ans = ''
	for i in range(0,4):
		char = chr(65 + i)
		if bubble(im, x1, y1+i*delta) == 1:
			ans = ans + char
	return ans

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
		x = int(coord[0]) + 1
		imPathnew = imPath + str(x) + ".jpg"
		xref11 = int(coord[1])
		yref11 = int(coord[2])
		xref21 = int(coord[3])
		yref21 = int(coord[4])
		qtype = coord[5]
		if qtype == "true/false":
			evalans = ml(xref21, xref11, yref11, yref21, imPathnew)
			if ((evalans != "T") and (evalans != "F")) :
				evalans = "To be Checked Manually"
			print(str(index) + ' Key :' + ansar[q] + ' Evaluated Answer: ' + evalans)
			if ansar[q] == evalans:
				score = score + 1
			q = q + 1
		elif qtype == "MCQ":
			evalans2 = multiplechoice(xref11, yref11, xref21, yref21, imPathnew)
			print(str(index) + ' Key :' + ansar[q] + ' Evaluated Answer: ' + evalans2)
			if evalans2 == ansar[q]:
				score = score + 1
			q = q + 1
		else:
			print("Other type of question")
	fin.close()
	ansfin.close()
	return score
def ml(xref21, xref11, yref11, yref21, path2):
	# '-l eng'  for using the English language
	# '--oem 1' for using LSTM OCR Engine
	# '--psm 10' for single character recognition
	# whitelist determines the sample space to look for characters
	config = ('--dpi 200 -l eng --oem 2 --psm 10 -c tessedit_char_whitelist=TF')
	# Read image from server
	im = cv2.imread(path2, cv2.IMREAD_GRAYSCALE)
	if im is None:
		print("There is no file at " + path2)
		return "There is no file"
	im2 = im[int(yref11):int(yref21), int(xref11):int(xref21)]
	retval, im3 = cv2.threshold(im2, 200, 255, cv2.THRESH_BINARY)
	#cv2.imshow("cropped", im3)
	#cv2.waitKey(0)
	# Run tesseract OCR on image
	corrected = pytesseract.image_to_string(im3, config=config)
	return corrected
if __name__ == "__main__":
	imPath = sys.argv[1]
	
	print(str(take_question(imPath)))
	