import cv2
import sys
import pytesseract
import numpy as numpy

if __name__ == "__main__":
    im = cv2.imread("bubble.jpg", cv2.IMREAD_GRAYSCALE)
    dim = im.shape
    total = 0
    dots = 0
    for x in range(0,dim[0]):
        for y in range(0,dim[1]):
            k = im[x, y]
            total = total + 1
            if k < 170:
                print("*", end ='')
                dots = dots + 1
            else:
                print(" ", end = '')
        print("\n")
    print(dim)
    print(str(dots) + ' ' + str(total) + ' ' + str(dots/total))
    if dots/total > 0.4:
        print("darkened")