import sys

with open(sys.argv[1], 'r') as my_file:
	print("NEw:")
	print(my_file.read());
	my_file.close();