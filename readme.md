## World economy overview


### Introduction

A visualization project for world economy.

It utilizes economic data from the world bank, and shows econ data about all countries in one map.

Use D3.js as the front-end framework and Flask as the back-end framework

1. Realize the display of basic economic data of countries around the world

2. Classification and statistics of rich countries and big countries

3. Multi-dimensional depiction of economic data for each country

4. Separate front and back of the system, easy to expand and maintain


### Page Partition

#### world map

The world map is used for the selection of countries around the world. The depth is population density.

When the mouse is moved over the country, it will trigger the display of economic details of the country for the year.

#### Global Economic Research Area

There are two charts in this section, which are the share of the global economy by income (pie chart) and the proportion of large population countries (pie chart).

#### Rich and poor global income pie

The four sections of the pie map represent high-income countries, upper-middle-income countries, lower-middle-income countries, and low-income countries, respectively.

Note: According to the World Bank's 2015 standards, per capita GDP is less than 1045 US dollars for low-income countries, between 1045 and 4125 US dollars for lower-middle-income countries, and between 4126 and 12735 US dollars for upper-middle-income countries At $ 12,736 for high-income countries.

#### Big and small countries global population pie

The two parts of the pie map represent the most populated countries and the less populated countries.

Note: According to general standards, countries with a population of more than 100 million are considered as countries with a large population, and the rest are countries with a small population.

#### National Economic Research Area

There are two charts in this section. The main chart is the country's economic details (list). The figure is a histogram of some economic data.

#### Country economic details country detail

A bar chart shows detailed economic data of a country for a certain year. For each country, there are 6 parameters

Total population, economic aggregate, GDP per capita, unemployment rate, proportion of arable land, Internet penetration rate, female labor participation rate


### Linkage Design

Mouse over a country area on the world map, and the National Economic Research Area on the right will display the data for that year.


## Code Structure

├── run.py
├── static
│   ├── bootstrap.css
│   ├── bootstrap.js
│   ├── countriesData.csv
│   ├── index.js
│   ├── jquery.js
│   └── style.css
└── templates
    └── index.html


## Get Started

```
Open command line
Enter the project directory
>> python run.py
Project begining
Open browser
>> http://127.0.0.1:5000/
Start browsing
```

### Page Display

<img src = "view.png">

### Analysis Methods

1. Logarithmic compression: In economic statistics, some parameters are too different (for example, GDP per capita, rich countries such as Singapore have 90,000 US dollars, but poor countries such as Sudan have only a few hundred US dollars). Therefore, a logarithmic compression method is adopted for easy display.
2. Multi-dimensional display: Use the world map to select the country, and use the histogram to display the details for each country. The global economic data is designed to classify countries in two dimensions: population and economy.

### Discovery and Inquiry

#### Visualization

1. Normalization processing: When using heat maps, normalization processing is required. Absolute values ​​cannot be used for many density graphics.
2. Page integration: all charts should be merged on the same page
3. Scale compression: At the beginning of displaying economic data, the regions with high per capita GDP were very sparse due to rich countries being too rich. At this time, I performed a scale conversion of the "Rich Wealth Index". For the per capita GDP, first take the logarithm of 10, and then The average compression between the maximum and minimum is 0 ~ 100.
4. Page Linkage: Use World Map to Select Countries

#### Engineering Optimization

1. Unified front-end and back-end interface format: The back-end preprocesses the data and transmits the front-end ($ .getJSON (url, function)) in json format.
2. Speed ​​optimization: read the data as a global variable at one time when the project is started, and then always use this variable to respond to increase the speed.
3. Data preprocessing: use pandas' df to process the data, and use df [(df ['attr']> 100)]
4. Data preprocessing: data type conversion, .astype (np.int32)

#### Problems and solutions

1. Google Chrome's script memory problem: Disable script memory in developer tools, otherwise no new JavaScript scripts will be loaded.
2. div alignment problem: often encountered the problem of div suddenly flying far away during typesetting, and finally the absolute positioning is uniformly used to fix all divs.
3. Insufficient design in the early stage: Insufficient design in the early stage causes frequent changes when writing code, which delays a lot of time. Later, a prototype is drawn first, which is much better.

#### Interesting discovery

1. According to World Bank standards, the global share of the population living in rich countries is decreasing year by year. This result sounds shocking, but there is actually a reason. The total number of rich countries in the world has not changed much in a few years, while the population growth of rich countries is generally slow or even decreasing (Japan, South Korea, France), but the population of poor countries is growing rapidly (Nigeria, Bangladesh). So while the world economy is growing, the proportion of the population in rich countries is decreasing.
2. The highest proportion of cultivated land area in the world: India, more than half of the land is cultivated. The lowest proportion of arable land is: Oman, a desert country in the Persian Gulf, rich in oil.
3. Regions with high unemployment are chaotic, such as Libya and Iraq. There are only two exceptions: Spain ’s unemployment rate is 26%, and Greece ’s unemployment rate is 27%. However, it is a developed country.
