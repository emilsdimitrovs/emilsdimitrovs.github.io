import React, { useCallback, useEffect, useState } from 'react';
import './index.css';

const Main = () => {
    const [doc, setDoc] = useState(null);
    const [windowSize, setWindowSize] = useState(null)

    const width = windowSize?.width ?? 1400;
    const height = windowSize?.height ?? 900;


    const draw = useCallback((x, y, c, s) => {
        const m = document.getElementById("life")?.getContext('2d');
        if (m) m.fillStyle = c;
        m.fillRect(x, y, s, s);
    }, [])
    

    var particles = []; // eslint-disable-line

    const particle = useCallback((x, y, c) => {
        return { "x": x, "y": y, "vx": 0, "vy": 0, "color": c }
    },[])

    const random = useCallback(() => {
        return Math.random() * 1900;
    }, [])

    const create = useCallback((number, color) => {
        let group = []

        for (let i = 0; i < number; i++) {
            group.push(particle(random(), random(), color));
            particles.push(group[i])
        }
        return group;
    },[particle, particles, random])

    const rule = useCallback((particles1, particles2, g) => {
        for (let i = 0; i < particles1.length; i++) {
            let fx = 0;
            let fy = 0;
            for (let j = 0; j < particles2.length; j++){
                var a = particles1[i];
                var b = particles2[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;

                const d = Math.sqrt(dx * dx + dy * dy);
                if (d > 0 && d < 80) {
                    const F = g * 1 / d;
                    fx += (F * dx);
                    fy += (F * dy);
                }
            }
            a.vx = (a.vx + fx) * 0.5;
            a.vy = (a.vy + fy) * 0.5;

            a.x += a.vx;
            a.y += a.vy;

            if (a.x <= 0 || a.x >= windowSize?.width - 50) {
                a.vx *= -1;
            };
            if (a.y <= 0 || a.y >= windowSize?.height - 50) {
                a.vy *= -1;
            };
        }
    }, [windowSize])

    const yellow = create(1200, "yellow");
    const red = create(900, "red");
    const green = create(600, "green");
    var blue = create(0, "blue");

    const update = useCallback(() => {
        const m = document.getElementById("life")?.getContext('2d');
        rule(blue, red, 0.5);
        rule(blue, yellow, 0.5);
        rule(blue, green, 0.5);
        rule(red, red, 0.1);
        rule(yellow, red, 0.15)
        rule(green, green, -0.7);
        rule(green, red, -0.2)
        rule(red, green, -0.1)
        m.clearRect(0, 0, width, height);
        if (m) m.fillStyle = "black";
        m.fillRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            draw(particles[i].x, particles[i].y, particles[i].color, 5)
        }
    }, [draw, particles, yellow, red, green, blue, rule, height, width])
    


    const tick = useCallback(() => {
        update();
        requestAnimationFrame(tick);
        particles.filter((p) => p.color === "blue" ? console.log(p) : null);
    }, [update, particles])
    
    
    useEffect(() => {
        if (!doc) return;
        window.onresize = function () {
            const size = {
                width: window.innerWidth,
                height: window.innerHeight,
            };
            setWindowSize(size)
        }
        tick();
    }, [tick, particles, doc])

    const insertCreate = useCallback((number, color, x, y) => {
        let group = []

        for (let i = 0; i < number; i++) {
            group.push(particle(x,y, color));
            particles.push(group[i])
        }
    }, [particle, particles])

    const mouseClickEvent = useCallback((x, y) => {
        blue.current = insertCreate(2, "blue", x, y);
        update();
    },[insertCreate, update, blue])

    window.onload = function () {
        const m = document.getElementById("life")?.getContext('2d');
        const canvas = document.getElementById("life");
        if (m) {
            setDoc(m);
            const size = {
                width: window.innerWidth,
                height: window.innerHeight,
            };
            setWindowSize(size)
        }

        canvas?.addEventListener('mousedown', function (event) {
            var rect = canvas.getBoundingClientRect();
            mouseClickEvent(event.x - rect.left, event.y - rect.top);
        });
    }

    return (
            <canvas id="life" width={width} height={height}>
            </canvas>

    )
}


export default Main;