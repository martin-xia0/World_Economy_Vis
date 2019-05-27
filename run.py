from flask import Flask, render_template, request
from flask import jsonify
import numpy as np
import json
import pandas as pd
import os

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))


@app.route('/')
def index():
    return render_template('index.html')


@app.route("/<int:id>")
def get_id(id):
    print(id)
    return jsonify({"score": id + 1})


@app.route("/country_list")
def get_country_list():
    # 国家清单
    data = global_names
    # print(data)
    return jsonify({"data": data})


@app.route('/global/income/<year>')
def global_income_pie(year):
    # 全球收入划分
    print("global_income_pie")
    df = global_data[(global_data['SeriesName'] == "GDP per capita (current US$)")]
    high = 0
    higher_middle = 0
    lower_middle = 0
    low = 0
    for row in df.index:
        try:
            gdp_per_capital = float(df[year][row])
            country = df['CountryName'][row]
            series = global_data[
                (global_data['CountryName'] == country) & (global_data['SeriesName'] == "  Population- total  ")]
            population = int(series[year].values[0])
            if gdp_per_capital > 12736:
                high += population
            elif gdp_per_capital > 4125:
                higher_middle += population
            elif gdp_per_capital > 1024:
                lower_middle += population
            else:
                low += population
        except:
            pass
    data = [
        {"x": "富裕国家", "y": high},
        {"x": "中等高收入", "y": higher_middle},
        {"x": "中等低收入", "y": lower_middle},
        {"x": "贫穷国家", "y": low}
    ]
    # print(high.head(5))
    return jsonify({"data": data})


@app.route('/global/pop/<year>')
def global_pop_pie(year):
    # 全球人口大国划分
    print("global_income_pie")
    df = global_data[(global_data['SeriesName'] == "  Population- total  ")]
    high = 0
    small = 0
    for row in df.index:
        try:
            country = df['CountryName'][row]
            series = global_data[
                (global_data['CountryName'] == country) & (global_data['SeriesName'] == "  Population- total  ")]
            population = int(series[year].values[0])
            if population > 100000000:
                high += population
            else:
                small += population
        except:
            pass
    data = [
        {"x": "人口大国", "y": high},
        {"x": "人口小国", "y": small},
    ]
    # print(high.head(5))
    return jsonify({"data": data})


@app.route('/global/detail/<year>/<int:xaxis>')
def global_detail_bubble(year, xaxis):
    # 全球经济详情
    """
    码字对照
    xaxis：
    0："  Labor force- female (% of total labor force)  "
    1："  Unemployment- total (% of total labor force) (modeled ILO estimate)  "
    2: "Arable land (% of land area)"
    yaxis:
    "GDP per capita (current US$)"
    """
    xaxis = ["  Labor force- female (% of total labor force)  ",
             "  Unemployment- total (% of total labor force) (modeled ILO estimate)  ",
             "Arable land (% of land area)"][xaxis]
    yaxis = "GDP per capita (current US$)"
    data = []
    x_max = 0
    for name in global_names:
        try:
            df = global_data[(global_data['CountryName'] == name)]
            x_series = df[(df['SeriesName'] == xaxis)][year]
            x_val = float(x_series.values[0])
            y_val = float(df[(df['SeriesName'] == yaxis)][year].values[0])
            pop = df[(df['SeriesName'] == "  Population- total  ")][year].values[0]
            if x_val > x_max:
                x_max = x_val
            data.append({"county": name,
                         "x": x_val,
                         "y": y_val,
                         "pop": pop})
        except:
            pass
    # print(data)
    return jsonify({"data": data})



@app.route('/country/detail/<year>/<country_code>')
def country_development_line(year, country_code):
    # 国家发展进程
    df = global_data[(global_data['CountryCode'] == country_code)]
    country = df['CountryName'].values[0]
    population = df[(global_data['SeriesName'] == "  Population- total  ")][year].values[0]
    data = [
            {'key': "总人口", 'val': population},
            {'key': "国家生产总值", 'val': df[(global_data['SeriesName'] == "GDP (current US$)")][year].values[0]},
            {'key': "人均GDP", 'val': df[(global_data['SeriesName'] == "GDP per capita (current US$)")][year].values[0]},
            {'key': "互联网普及率", 'val': df[(global_data['SeriesName'] == "Internet users (per 100 people)")][year].values[0]},
            {'key': "女性劳动参与率", 'val': df[(global_data['SeriesName'] == "  Labor force- female (% of total labor force)  ")][year].values[0]},
            {'key': "失业率", 'val': df[(global_data['SeriesName'] == "  Unemployment- total (% of total labor force) (modeled ILO estimate)  ")][year].values[0]},
            {'key': "耕地比例", 'val': df[(global_data['SeriesName'] == "Arable land (% of land area)")][year].values[0]}
            ]
    return jsonify({"data": data, "country": country})


def process_data():
    """
    将数据文件初始化为pd DataFrame
    :return:
    """
    data_dir = basedir + '\static\countriesData.csv'
    df = pd.read_csv(data_dir, encoding='utf-8')
    # print(df.head(5))
    # print(df.describe())
    return df


if __name__ == '__main__':
    # 加载全局数据集
    global_data = process_data()
    global_names = list(set(global_data["CountryName"].values))
    app.run(debug=True)
