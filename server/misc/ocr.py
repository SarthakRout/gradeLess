import sys

imgpath = sys.argv[1]
fin = open('coord.txt', 'r')
lines_list = fin.readlines()
for line in lines_list:
	coord = line.split(' ')
	xref11 = coord[0]
	yref11 = coord[1]
	xref21 = coord[2]
	yref21 = coord[3]
print('xref11:' + xref11)
print('yref11:' + yref11)
print('xref21:' + xref21)
print('yref21:' + yref21)
fin.close()

