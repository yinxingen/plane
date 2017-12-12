window.onload = function() {
    new Engine();
}

function Engine() {
    this.ele = document.getElementById("body_main");
    this.init();
}
Engine.prototype = {
    init: function() {
        var oLi = this.ele.children[0].children;
        var that = this;
        for (var i = 0; i < oLi.length; i++) {
            oLi[i].index = i;
            oLi[i].onclick = function() {
                this.parentNode.remove();
                that.sport();
                that.frequency = this.index;
            }
        }
    },
    sport: function() {
        this.logo = createEle("div", "logo");
        appendBody(this.logo);
        this.loading = createEle("div", "loading");
        appendBody(this.loading);
        var that = this;
        var index = 1;
        var loadingTimer = setInterval(function() {
            that.loading.style.background = "url(images/loading" + (index++ % 3 + 1) + ".png) no-repeat"
        }, 500);
        var positionY = 0;
        setInterval(function() {
            that.ele.style.backgroundPositionY = ++positionY + "px";
        }, 50);

        setTimeout(function() {
            that.logo.remove();
            that.loading.remove();
            clearInterval(that.loadingTimer);
            that.gameStart();
        }, 1000);
    },
    gameStart: function() {
        Plane.init();
        Plane.fire(this.frequency);
        this.createEnemy()
    },
    createEnemy: function() {
        setInterval(function() {
            Math.random() > 0.5 ? new Enemy(0) : "";
        }, 500);
        setInterval(function() {
            Math.random() > 0.5 ? new Enemy(1) : "";
        }, 3000);
        setInterval(function() {
            Math.random() > 0.2 ? new Enemy(2) : "";
        }, 8000);
    }
}

function Enemy(type) {
    this.type = type;
    this.init();
}
Enemy.prototype = {
    init: function() {
        switch (this.type) {
            case 0:
                this.ele = createEle("div", "enemy-small");
                this.hp = 1;
                this.speed = 7;
                break;
            case 1:
                this.ele = createEle("div", "enemy-middle");
                this.hp = 5;
                this.speed = 5;
                break;
            case 2:
                this.ele = createEle("div", "enemy-large");
                this.hp = 50;
                this.speed = 2;
                break;
        }
        appendBody(this.ele);
        this.position();
    },
    position: function() {
        var body_main = document.getElementById("body_main");
        this.ele.style.top = 0;
        this.ele.style.left = randomInt(body_main.offsetLeft, body_main.offsetLeft + body_main.offsetWidth - this.ele.offsetWidth) + "px";
        this.move();
    },
    move: function() {
        var that = this;
        this.timer = setInterval(function() {
            that.ele.style.top = that.ele.offsetTop + that.speed + "px";
            that.collision();
            if (that.ele.offsetTop >= document.documentElement.clientHeight) {
                that.ele.remove();
                clearInterval(that.timer);
            }
        }, 30);
    },
    collision: function() {
        for (var i = 0; i < Plane.bullet.length; i++) {
            //检测top值
            if (Math.abs(Plane.bullet[i].ele.offsetTop - this.ele.offsetTop) <= this.ele.offsetHeight) {
                //检测left值
                if (Math.abs(this.ele.offsetLeft - Plane.bullet[i].ele.offsetLeft) <= this.ele.offsetWidth) {
                    Plane.bullet[i].boom();
                    this.hp--;

                    if (this.hp <= 0) {
                        this.ele.remove();
                        clearInterval(this.timer);
                    }
                }
            }
        }
        //敌我飞机碰撞检测
        if (Math.abs(Plane.ele.offsetTop - this.ele.offsetTop) <= this.ele.offsetHeight) {
            if (Math.abs(this.ele.offsetLeft - Plane.ele.offsetLeft) <= this.ele.offsetWidth) {
                var restart = confirm("是否重新开始");
                if (restart) {
                    location.reload();
                } else {
                    close();
                }
            }
        }
    }
}
var Plane = {
    ele: createEle("div", "my-warplain"),
    init: function() {
        appendBody(this.ele);
        this.ele.style.left = document.documentElement.clientWidth / 2 - this.ele.offsetWidth / 2 + "px";
        this.ele.style.top = document.documentElement.clientHeight - this.ele.offsetHeight + "px";
        this.move();
    },
    move: function() {
        var body_main = document.getElementById("body_main");
        var that = this;
        document.onmousemove = function(evt) {
            var e = evt || window.event;
            var left = e.clientX - that.ele.offsetWidth / 2;
            var top = e.clientY - that.ele.offsetHeight / 2;
            if (left <= body_main.offsetLeft) {
                left = body_main.offsetLeft;
            }
            if (left > body_main.offsetLeft + body_main.offsetWidth - that.ele.offsetWidth) {
                left = body_main.offsetLeft + body_main.offsetWidth - that.ele.offsetWidth
            }
            if (top <= 0) {
                top = 0;
            }
            if (top > document.documentElement.clientHeight - that.ele.offsetHeight) {
                top = document.documentElement.clientHeight - that.ele.offsetHeight;
            }
            that.ele.style.left = left + "px";
            that.ele.style.top = top + "px";
        }
    },
    fire: function(frequency) {
        var myFrequency = 200;
        switch (frequency) {
            case 0:
                myFrequency = 400;
                break;
            case 1:
                myFrequency = 300;
                break;
            case 2:
                myFrequency = 200;
                break;
            case 3:
                myFrequency = 80;
                break;
        }
        var bulletId = 0;
        var that = this;
        this.timer = setInterval(function() {
            that.bullet.push(new Bullet(bulletId));
            bulletId++;
        }, myFrequency)
    },
    bullet: []
}

function Bullet(id) {
    this.id = id;
    this.ele = createEle("div", "bullet")
    this.init();
}
Bullet.prototype = {
        init: function() {
            this.ele.id = this.id;
            appendBody(this.ele);
            this.ele.style.left = Plane.ele.offsetLeft + Plane.ele.offsetWidth / 2 - this.ele.offsetWidth / 2 + "px";
            this.ele.style.top = Plane.ele.offsetTop - this.ele.offsetHeight + "px";
            this.move();
        },
        move: function() {
            var that = this;
            this.timer = setInterval(function() {
                that.ele.style.top = that.ele.offsetTop - 15 + "px";
                if (that.ele.offsetTop <= 10) {
                    that.boom();
                }
            }, 50)
        },
        boom: function() {
            this.ele.className = "bullet_die";
            clearInterval(this.timer);
            var that = this;
            setTimeout(function() {
                that.ele.remove();
                for (var i = 0; i < Plane.bullet.length; i++) {
                    if (that.ele.id == Plane.bullet[i].id) {
                        Plane.bullet.splice(i, 1);
                    }
                }
            }, 50);
        }
    }
    //工具箱
Element.prototype.remove = function() {
    try {
        this.parentNode.removeChild(this);
    } catch (e) {}
}

function createEle(target, className) {
    var ele = document.createElement(target);
    ele.className = className;
    return ele;
}

function appendBody(ele) {
    document.body.appendChild(ele);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}