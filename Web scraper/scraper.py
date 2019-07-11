from bs4 import BeautifulSoup
import requests
import time

titleClass = "css-78jh1y"
######################### NETFLIX #######################
print("starting netflix")
netflixLibraryURL = "https://reelgood.com/movies/source/netflix?offset=0"

pageResponse = requests.get(netflixLibraryURL, timeout=5)

pageContent = BeautifulSoup(pageResponse.content, "html.parser")
pageContent.encode("utf-8")

titleList = open("Web scraper/netflixtitles.txt" , "w")
titleList.write("")
titleList.close()

titleList = open("Web scraper/netflixtitles.txt" , "a",newline='',encoding="utf-8")
titleArray = []

for i in range(0,1000):
	netflixLibraryURL = "https://reelgood.com/movies/source/netflix?offset=" + str(i*50)
	pageResponse = requests.get(netflixLibraryURL, timeout=5)
	pageContent = BeautifulSoup(pageResponse.content, "html.parser")
	titleContainerArray = pageContent.find_all("td", titleClass)
	if(len(titleContainerArray)== 0):
		break
	for container in titleContainerArray:
		titleArray.append(container.find("a").text)
for title in titleArray:
	titleList.write(title)
	titleList.write(",")
titleList.close()
print("netflix done")
############### HULU #################
print("starting hulu")
titleList = open("Web scraper/hulutitles.txt", "w",)
titleList.write("")
titleList.close()
titleList = open("Web scraper/hulutitles.txt", "a",newline='',encoding="utf-8")
titleArray = []

for i in range(0,1000):
	huluLibraryURL = "https://reelgood.com/source/hulu?filter-sort=4&offset=" + str(i*50)
	pageResponse = requests.get(huluLibraryURL, timeout=5)
	pageContent = BeautifulSoup(pageResponse.content, "html.parser")
	titleContainerArray = pageContent.find_all("td", titleClass)
	if(len(titleContainerArray)== 0):
		break
	for container in titleContainerArray:
		titleArray.append(container.find("a").text)
for title in titleArray:
	titleList.write(title)
	titleList.write(",")
titleList.close()
print("hulu done")
################### AMAZON #####################
print("starting amazon")
titleList = open("Web scraper/amazonTitles.txt", "w")
titleList.write("")
titleList.close()
titleList = open("Web scraper/amazonTitles.txt", "a",newline='',encoding="utf-8")
titleArray = []

for i in range(0,1000):
	amazonURL = "https://reelgood.com/movies/source/amazon?filter-sort=4&offset=" + str(i*50)
	pageResponse = requests.get(amazonURL, timeout=5)
	pageContent = BeautifulSoup(pageResponse.content, "html.parser")
	titleContainerArray = pageContent.find_all("td", titleClass)
	if(len(titleContainerArray)== 0):
		break
	for container in titleContainerArray:
		titleArray.append(container.find("a").text)

for title in titleArray:
	titleList.write(title)
	titleList.write(",")
titleList.close()
print("amazon done")

################################## HBO #################################
print("starting HBO")
titleList = open("Web scraper/hboTitles", "w")
titleList.write("")
titleList.close()
titleList = open("Web scraper/hboTitles", "a",newline='',encoding="utf-8")
titleArray = []

for i in range(0,1000):
	hboURL = "https://reelgood.com/movies/source/hbo?offset=" + str(i*50)
	pageResponse = requests.get(hboURL, timeout=5)
	pageContent = BeautifulSoup(pageResponse.content, "html.parser")
	
	titleContainerArray = pageContent.find_all("td", titleClass)
	if(len(titleContainerArray)== 0):
		break
	for container in titleContainerArray:
		titleArray.append(container.find("a").text)
for title in titleArray:
	titleList.write(title)
	titleList.write(",")
titleList.close()
print("HBO done")