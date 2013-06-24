;(function (exports) {
    function Sphere (x, y, z, radius) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius; 
        this.Material = new Material(); 
    }

    Sphere.prototype = {
        intersections: function (r) {
            var ray_unit = r.unitVector();
            var xu = ray_unit[0];
            var yu = ray_unit[1];
            var zu = ray_unit[2];
            
            var a = xu*xu+yu*yu+zu*zu; 
            var b = 2 * (xu*(r.x - this.x) +yu*(r.y - this.y) + zu*(r.z - this.z));
            var c = (((r.x-this.x)*(r.x-this.x))+((r.y-this.y)*(r.y-this.y))+((r.z-this.z)*(r.z-this.z)))-this.radius*this.radius; 
            var disc = b*b-4*a*c;
            if (disc<0) {
                return [];
            } else if (disc===0){
                var dist = -b/2*a; 
                return [coords(dist)];
            } else if (disc>0){
                var dist1 = (-b - Math.sqrt(disc))/(2*a); 
                var dist2 = (-b + Math.sqrt(disc))/(2*a); 
                return [coords(dist1), coords(dist2)];
            } else {
                throw "logic error!";
            }
            function coords (d) {
                var x = r.x + d*xu;
                var y = r.y + d*yu; 
                var z = r.z + d*zu; 
                return [x, y, z];
            };
        },
        normal: function (x, y, z) {
            var point_x = x; 
            var point_y = y;
            var point_z = z;
            var sphere_x=this.x;
            var sphere_y=this.y;
            var sphere_z=this.z;
            var sphere_r=this.radius;
            
            var N = [(point_x-sphere_x)/sphere_r, (point_y-sphere_y)/sphere_r, (point_z-sphere_z)/sphere_r];
            return N; 
        }
    };

    function Plane(point, vector) {
        this.point = point; 
        this.norm = new ray(vector[0]+point[0], vector[1]+point[1], vector[2]+point[2], point[0], point[1], point[2]); 
        this.Material = new Material(); 
    }

    Plane.prototype = {
        intersections: function(ry) {
            var unit = ry.unitVector();
            var n = this.normal();
            var px = this.norm.x;
            var py = this.norm.y;
            var pz = this.norm.z;
            var dot = this.norm.dotProduct(ry); 
           // var dot = (unit[0]*n[0] + unit[1]*n[1] + unit[2]*n[2]);
            var d = ((px-ry.x)*n[0]+(py-ry.y)*n[1]+(pz-ry.z)*n[2])/dot;
            if (dot===0||dot>0){
                return [];
            } else {
                return [[ry.x+unit[0]*d, ry.y+unit[1]*d, ry.z+unit[2]*d]]; 
            }
        }, 
        normal: function () {
            return this.norm.unitVector();
        }
    };

    function Cube (x, y, z, size) {
        this.x=x; 
        this.y=y; 
        this.z=z; 
        this.size = size;
        this.Material = new Material(); 
        this.front = new Plane([x, y, z+size/2,],[0,0,1]);
        this.back = new Plane([x, y, z-size/2],[0,0,-1]);
        this.left = new Plane([x-size/2, y, z],[-1, 0, 0]);
        this.right = new Plane([x+size/2, y, z],[1, 0, 0]);
        this.up = new Plane([x, y-size/2, z],[0, -1, 0]);
        this.down = new Plane([z, y+size/2, z],[0, 1, 0]);
    }

    Cube.prototype = {
        intersections: function(ry) {
            var a = this.front.intersections(ry);             
           // if (a[0]>this.x-this.size/2 && a[0]<this.x+this.size/2) {
                return [a]; 
           // }else {
                return [];
           // }
        }, 
        normal: function() {
            return this.front.normal();
        }
    };
    exports.Cube=Cube; 
    exports.Plane=Plane; 
    exports.Sphere=Sphere; 
})(this); 
