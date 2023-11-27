let totalParticles,mRadius,particles=[],scrollSpeed=.1;const minScrollSpeed=.02,maxScrollSpeed=1;function setup(){createCanvas(windowWidth,windowHeight).parent("particle-container"),totalParticles=width*height/1e4,mRadius=height/80*width/80;for(let i=0;i<totalParticles;i++)particles.push(new Particle)}function draw(){clear(),particles.forEach((i=>{i.update(),i.render()})),connect()}function connect(){for(let i=0;i<totalParticles;i++)for(let t=i;t<totalParticles;t++){let s=pow(particles[i].x-particles[t].x,2)+pow(particles[i].y-particles[t].y,2);if(s<width*height/50){let e=1-s/1e4;e=map(e,0,1,0,255),stroke(0,255,195,e),line(particles[i].x,particles[i].y,particles[t].x,particles[t].y)}}}function mouseWheel(i){scrollSpeed+=.001*i.delta,scrollSpeed=constrain(scrollSpeed,.02,1)}class Particle{constructor(){this.size=random(1,7),this.x=random(2*this.size,windowWidth-2*this.size),this.y=random(2*this.size,windowHeight-2*this.size),this.originalX=this.x,this.originalY=this.y,this.dirX=random(-7,7),this.dirY=random(-7,7),this.color="rgb(0, 255, 195)",this.speed=.3,this.hoverSpeed=.3}update(){(this.x>width||this.x<0)&&(this.dirX=-this.dirX),(this.y>height||this.y<0)&&(this.dirY=-this.dirY);let i=mouseX-this.x,t=mouseY-this.y;sqrt(i*i+t*t)<this.size+mRadius&&(mouseX<this.x&&this.x<width-10*this.size&&(this.x+=10),mouseX>this.x&&this.x>10*this.size&&(this.x-=10),mouseY<this.y&&this.y<height-10*this.size&&(this.y+=10),mouseY<this.y&&this.y>10*this.size&&(this.y-=10)),this.x+=this.dirX*this.speed,this.y+=this.dirY*this.speed}render(){ellipse(this.x,this.y,this.size),noStroke(),fill(this.color)}}
