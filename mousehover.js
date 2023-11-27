        let totalParticles, particles = [],
        	mRadius, scrollSpeed = 0.1;
        const minScrollSpeed = 0.02,
        	maxScrollSpeed = 1;

        function setup() {
        	let canvas = createCanvas(windowWidth, windowHeight);
        	canvas.parent('particle-container');
        	totalParticles = (width * height) / 10000;
        	mRadius = (height / 80) * width / 80;
        	for (let i = 0; i < totalParticles; i++) particles.push(new Particle());
        }

        function draw() {
        	clear();
        	particles.forEach(p => {
        		p.update();
        		p.render();
        	});
        	connect();
        }

        function connect() {
        	for (let a = 0; a < totalParticles; a++) {
        		for (let b = a; b < totalParticles; b++) {
        			let distance = pow(particles[a].x - particles[b].x, 2) + pow(particles[a].y - particles[b].y, 2);
        			if (distance < (width * height) / 50) {
        				let opaq = 1 - distance / 10000;
        				opaq = map(opaq, 0, 1, 0, 255);
        				stroke(0, 255, 195, opaq);
        				line(particles[a].x, particles[a].y, particles[b].x, particles[b].y);
        			}
        		}
        	}
        }

        function mouseWheel(event) {
        	scrollSpeed += event.delta * 0.001;
        	scrollSpeed = constrain(scrollSpeed, minScrollSpeed, maxScrollSpeed);
        }

        class Particle {
        	constructor() {
        		this.size = random(1, 7);
        		this.x = random(this.size * 2, windowWidth - this.size * 2);
        		this.y = random(this.size * 2, windowHeight - this.size * 2);
        		this.originalX = this.x;
        		this.originalY = this.y;
        		this.dirX = random(-7, 7);
        		this.dirY = random(-7, 7);
        		this.color = "rgb(0, 255, 195)";
        		this.speed = 0.3;
        		this.hoverSpeed = 0.3;
        	}

        	update() {
        		if (this.x > width || this.x < 0) this.dirX = -this.dirX;
        		if (this.y > height || this.y < 0) this.dirY = -this.dirY;

        		let dx = mouseX - this.x;
        		let dy = mouseY - this.y;
        		let distance = sqrt(dx * dx + dy * dy);

        		if (distance < this.size + mRadius) {
        			if (mouseX < this.x && this.x < width - this.size * 10) this.x += 10;
        			if (mouseX > this.x && this.x > this.size * 10) this.x -= 10;
        			if (mouseY < this.y && this.y < height - this.size * 10) this.y += 10;
        			if (mouseY < this.y && this.y > this.size * 10) this.y -= 10;
        		}

        		this.x += this.dirX * this.speed;
        		this.y += this.dirY * this.speed;
        	}

        	render() {
        		ellipse(this.x, this.y, this.size);
        		noStroke();
        		fill(this.color);
        	}
        }
