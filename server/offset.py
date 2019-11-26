import cv2
import sys

path = sys.argv[1]
def offset(path):
	im = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
	if im is None:
		print("There is no file.")
	for i in range(50, 200):
		for j in range(50, 200):
			if (im[i, j] < 50):
				print(str(i)+' ' + str(j))
				return i, j
if __name__== "__main__":
	offset(path)

