from bs4 import BeautifulSoup
import requests
import time
########################## NETFLIX #######################
# netflixLibraryURL = "https://www.finder.com/netflix-movies"

# pageResponse = requests.get(netflixLibraryURL, timeout=5)

# pageContent = BeautifulSoup(pageResponse.content, "html.parser")

# titleList = open("netflixtitles.txt", "w")
# titleList.write("")
# titleList.close()

# titleList = open("netflixtitles.txt" , "a")

# titleArray = pageContent.find_all("b");


# for title in titleArray:
#     titleList.write(title.text)
#     titleList.write("\n")
# titleList.close()
############### HULU #################
titleList = open("hulutitles.txt", "w")
titleList.write("")
titleList.close()
titleList = open("hulutitles.txt", "a")
titleArray = []

for i in range(0,75):
    huluLibraryURL = "https://reelgood.com/source/hulu?filter-sort=4&offset=" + str(i*50)
    pageResponse = requests.get(huluLibraryURL, timeout=5)
    pageContent = BeautifulSoup(pageResponse.content, "html.parser")
    titleContainerArray = pageContent.find_all("td", "cd")
    for container in titleContainerArray:
        titleArray.append(container.find("a").text)

for title in titleArray:
    titleList.write(title)
    titleList.write("\n")
titleList.close()

################### AMAZON #####################
titleList = open("amazonTitles.txt", "w")
titleList.write("")
titleList.close()
titleList = open("amazonTitles.txt", "a")
titleArray = []

for i in range(0,264):
    amazonURL = "https://reelgood.com/movies/source/amazon?filter-sort=4&offset=" + str(i*50)
    pageResponse = requests.get(amazonURL, timeout=5)
    pageContent = BeautifulSoup(pageResponse.content, "html.parser")
    titleContainerArray = pageContent.find_all("td", "cd")
    for container in titleContainerArray:
        titleArray.append(container.find("a").text)

for title in titleArray:
    titleList.write(title)
    titleList.write("\n")
titleList.close()

