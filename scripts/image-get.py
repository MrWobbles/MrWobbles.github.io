from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import time
import requests
import os


def download_image(url, base_url='https://www.evanlloydarchitects.com'):
    # Ensure URL is absolute
    if not url.startswith(('http:', 'https:')):
        url = base_url + url if url.startswith('/') else f"{base_url}/{url}"
    filename = url.split('/')[-1]
    # Create images directory if it doesn't exist
    if not os.path.exists('images'):
        os.makedirs('images')
    filepath = os.path.join('images', filename)
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)
        print(f"Downloaded {filename}")

def collect_project_urls(driver, work_url):
    driver.get(work_url)
    # Wait for the sidebar to load
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "sidebar2"))
    )
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    sidebar = soup.find('aside', class_='sidebar2')
    project_urls = []
    if sidebar:
        for link in sidebar.find_all('a', href=True):
            href = link['href']
            if not href.startswith('http'):
                # Ensure the URL is absolute
                href = f"https://www.evanlloydarchitects.com/{href}" if not href.startswith('/') else f"https://www.evanlloydarchitects.com{href}"
            project_urls.append(href)
    else:
        print("Sidebar not found or no links within sidebar.")
    return project_urls


def scrape_project_images(driver, project_urls):
    for project_url in project_urls:
        driver.get(project_url)
        time.sleep(5)  # Wait for JavaScript to load and for images to be fully loaded
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        image_elements = soup.find_all('img')
        for element in image_elements:
            img_url = element.get('src')
            if img_url:  # Assuming you want all images, adjust if you're looking for specific images
                download_image(img_url)

def main():
    driver = webdriver.Safari()
    work_url = 'https://www.evanlloydarchitects.com/evan-lloyd-architects-work.php'

    project_urls = collect_project_urls(driver, work_url)
    scrape_project_images(driver, project_urls)

    driver.quit()

if __name__ == "__main__":
    main()
