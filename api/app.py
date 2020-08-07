from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import ast
app = Flask(__name__)
CORS(app)


@app.route('/check',methods=['GET', 'POST'])
def hello():
    data = request.json
    print(data)
    if data['polygon']:

        data=data['polygon']
        polyarr = data['polygonArray']
        # polyarr =np.array(polyarr)
        # print(type(polyarr))
        point = data['point']
        point = point.strip('][').split(',') 
        x = int(point[0])
        y = int(point[1])
        # print(polyarr)
        isInside = point_inside_polygon(x,y,polyarr)
        if isInside==True:
            isInside = "True"
        else:
            isInside = "False"    
    return jsonify(isInside)    


    # print(isInside)
    

@app.route('/sun',methods=['GET', 'POST'])   
def sun():
    data = request.json
    if data['sun']:
        data=data['sun']
        buildarr = data['Buildings']
        buildarr =eval(buildarr)
        point = data['point']
        point = point.strip('][').split(',')
        # print(buildarr) 
        n = len(buildarr)
        if n ==1:
            output=exposedToSunSingle(buildarr,point)
        else:    
            near=nearestBuilding(buildarr)
            output=exposedToSunMultiple(buildarr,point,near) 
    return jsonify(output)    

def point_inside_polygon(x,y,poly,include_edges=True):
    poly=eval(poly)
    n = len(poly)
    inside = False

    p1x, p1y = poly[0]
    for i in range(1, n + 1):
        p2x, p2y = poly[i % n]
        if p1y == p2y:
            if y == p1y:
                if min(p1x, p2x) <= x <= max(p1x, p2x):
                    # point is on horisontal edge
                    inside = include_edges
                    break
                elif x < min(p1x, p2x):  # point is to the left from current edge
                    inside = not inside
        else:  # p1y!= p2y
            if min(p1y, p2y) <= y <= max(p1y, p2y):
                xinters = (y - p1y) * (p2x - p1x) / float(p2y - p1y) + p1x

                if x == xinters:  # point is right on the edge
                    inside = include_edges
                    break

                if x < xinters:  # point is to the left from current edge
                    inside = not inside

        p1x, p1y = p2x, p2y

    return inside


def exposedToSunMultiple(arr,sun,near):
    # inde =arr.index(near)
    index_row = [arr.index(row) for row in arr if near in row][0]
    first_build = arr[index_row]
    if index_row == 0:
        sec_build = arr[1]
    sec_build = arr[0]    
    exposed = abs(first_build[1][1] - first_build[0][1])
    exposed += abs(first_build[3][0]- first_build[0][0])
    tanTheta = findTheta(first_build,sun)
    diffBuild = sec_build[0][0] - first_build[3][0]
    extra_len = tanTheta*diffBuild
    exposed += extra_len + abs(first_build[0][1])
    exposed += sec_build[3][0] - sec_build[0][0]
    exposed = round(float(exposed),2)
    return exposed

def exposedToSunSingle(arr,sun):
    # print(len(arr))
    first_build = arr[0]
    
    exposed = abs(first_build[1][1] - first_build[0][1])
    exposed += abs(first_build[3][0]- first_build[0][0])
    exposed = round(float(exposed),2)
    
    return exposed


def findTheta(first_build,sun):
    side1 = float(sun[1]) + float(abs(first_build[0][1]))
    width1 = abs(float(sun[0])) + first_build[3][0]
    # print(width1)
    tanTheta = side1/width1
    # print(tanTheta)

    return tanTheta

def nearestBuilding(arr):
    near_list = []
    xy = [0,0]
    for i in arr:
        dist = lambda x, y: (x[0]-y[0])**2 + (x[1]-y[1])**2
        a = min(i, key=lambda co: dist(co, xy))
        # print(a)
        near_list.append(a)
    dist = lambda x, y: (x[0]-y[0])**2 + (x[1]-y[1])**2
    a = min(near_list, key=lambda co: dist(co, xy))
    return a   

if __name__ == '__main__':
    app.run(debug=True, port=8000)
