from bs4 import BeautifulSoup
import requests
import time

titleClass = "dI"
################## SELENIUM SETUP ###################
driver = webdriver.Chrome()
driver.get("https://www.whats-on-netflix.com/library/movies/")

for i in range (0,124):
        WebDriverWait(driver,10).until(EC.presence_of_element_located((By.ID,"netflixlist-next")))
        driver.find_element(By.XPATH,  "//a[@id='netflixlist_next' and not(@disabled)]").click()
######################### NETFLIX #######################
print("starting netflix")
netflixLibraryURL = "https://reelgood.com/movies/source/netflix?offset=0"

pageResponse = requests.get(netflixLibraryURL, timeout=5)

pageContent = BeautifulSoup(pageResponse.content, "html.parser")

titleList = open("Web scraper/netflixtitles.txt" , "w")
titleList.write("")
titleList.close()

titleList = open("Web scraper/netflixtitles.txt" , "a")
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
titleList = open("Web scraper/hulutitles.txt", "w")
titleList.write("")
titleList.close()
titleList = open("Web scraper/hulutitles.txt", "a")
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
titleList = open("Web scraper/amazonTitles.txt", "a")
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
titleList = open("Web scraper/hboTitles", "a")
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