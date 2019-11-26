import cv2
import sys
import pytesseract
import numpy as numpy

if __name__ == "__main__":
    im = cv2.imread("xs.jpg", cv2.IMREAD_GRAYSCALE)
    dim = im.shape
    total = 0
    dots = 0
    center = [900,700]
    size = 50
    for x in range(center[0]-size,center[0]+size):
        for y in range(center[1]-size,center[1]+size):
            k = im[x, y]
            total = total + 1
            if k < 150:
                print("*", end ='')
                dots = dots + 1
            else:
                print(" ", end = '')
        print("\n")
    print(dim)
    print(str(dots) + ' ' + str(total) + ' ' + str(dots/total))
    if dots/total > 0.4:
        print("darkened")