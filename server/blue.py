import cv2
import sys
import pytesseract 
path = sys.argv[1]

if __name__ == "__main__":
	im = cv2.imread(path, cv2.IMREAD_COLOR)
	rows = im.shape[0]
	cols= im.shape[1]
	for i in range(500, 2200):
		for j in range(1400,1600):
			if im[i, j, 0] < 80 or im[i, j, 1] > 100 or im[i, j, 2] > 100:
				im[i, j, 0] = 255
				im[i, j, 1] = 255
				im[i, j, 2] = 255
			else:
				im[i, j, 0] = 255
				im[i, j, 1] = 0
				im[i, j, 2] = 0
	im2 = im[500:2200, 1400:1600]
	config = ('--dpi 200 -l eng --oem 2 --psm 5 -c tessedit_char_whitelist=TF')
	corrected = pytesseract.image_to_string(im2, config=config)
	cv2.imshow("new", im2)
	cv2.waitKey(0)
	print(corrected)