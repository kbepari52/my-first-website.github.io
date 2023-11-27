    function updateColor() {
    	const hue = document.getElementById('hue').value;
    	const saturation = document.getElementById('saturation').value;
    	const lightness = document.getElementById('lightness').value;
    	const alpha = document.getElementById('alpha').value;

    	const colorBox = document.getElementById('colorBox');
    	colorBox.style.backgroundColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;

    	const hslValue = document.getElementById('hslValue');
    	hslValue.textContent = `${hue}, ${saturation}%, ${lightness}%`;

    	const hslaValue = document.getElementById('hslaValue');
    	hslaValue.textContent = `${hue}, ${saturation}%, ${lightness}%, ${alpha}`;
    }
