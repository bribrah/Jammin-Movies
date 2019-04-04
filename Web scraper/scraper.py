from bs4 import BeautifulSoup
from selenium import webdriver 
from selenium.webdriver.common.by import By 
from selenium.webdriver.support.ui import WebDriverWait 
from selenium.webdriver.support import expected_conditions as EC 
from selenium.common.exceptions import TimeoutException
import requests
import time
########################## NETFLIX #######################
print("starting netflix")
netflixLibraryURL = "https://www.finder.com/netflix-movies"

pageResponse = requests.get(netflixLibraryURL, timeout=5)

pageContent = BeautifulSoup(pageResponse.content, "html.parser")

titleList = open("Web scraper/netflixtitles.txt", "w")
titleList.write("")
titleList.close()

titleList = open("Web scraper/netflixtitles.txt" , "a")

titleArray = pageContent.find_all("b");

for title in titleArray:
    titleList.write(title.text)
    titleList.write(",")
titleList.close()
print("netflix done")
############### HULU #################
print("starting hulu")
titleList = open("Web scraper/hulutitles.txt", "w")
titleList.write("")
titleList.close()
titleList = open("Web scraper/hulutitles.txt", "a")
titleArray = []

for i in range(0,75):
    huluLibraryURL = "https://reelgood.com/source/hulu?filter-sort=4&offset=" + str(i*50)
    pageResponse = requests.get(huluLibraryURL, timeout=5)
    pageContent = BeautifulSoup(pageResponse.content, "html.parser")
    titleContainerArray = pageContent.find_all("td", "c5")
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
titleList = open("Web scraper/amazonTitles.txt", "a")
titleArray = []

for i in range(0,264):
    amazonURL = "https://reelgood.com/movies/source/amazon?filter-sort=4&offset=" + str(i*50)
    pageResponse = requests.get(amazonURL, timeout=5)
    pageContent = BeautifulSoup(pageResponse.content, "html.parser")
    titleContainerArray = pageContent.find_all("td", "c5")
    for container in titleContainerArray:
        titleArray.append(container.find("a").text)

for title in titleArray:
    titleList.write(title)
    titleList.write(",")
titleList.close()
print("amazon done")
