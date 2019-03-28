from bs4 import BeautifulSoup
import requests
import time

netflixLibraryURL = "https://www.finder.com/netflix-movies"

pageResponse = requests.get(netflixLibraryURL, timeout=5)

pageContent = BeautifulSoup(pageResponse.content, "html.parser")

titleList = open("netflixtitles.txt", "w")
titleList.write("")
titleList.close()

titleList = open("netflixtitles.txt" , "a")

titleArray = pageContent.find_all("b");


for title in titleArray:
    titleList.write(title.text)
    titleList.write("\n")
titleList.close()
############### HULU #################
huluLibraryURL = "https://reelgood.com/source/hulu"
pageResponse = requests.get(huluLibraryURL, timeout=5)
pageContent = BeautifulSoup(pageResponse.content, "html.parser")

titleList = open("hulutitles.txt", "w")
titleList.write("")
titleList.close()
titleList = open("hulutitles.txt", "a")
titleArray = []

titleContainerArray = pageContent.find_all("td", "cd")
for container in titleContainerArray:
    titleArray.append(container.find("a").text)
print(titleArray)

for title in titleArray:
    titleList.write(title)
    titleList.write("\n")
titleList.close()


