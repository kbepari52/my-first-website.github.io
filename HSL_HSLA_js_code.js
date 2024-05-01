const hue = document.getElementById('hue');
        const saturation = document.getElementById('saturation');
        const lightness = document.getElementById('lightness');
        const alpha = document.getElementById('alpha');
        const colorBox = document.getElementById('colorBox');
        const hslValue = document.getElementById('hslValue');
        const hslaValue = document.getElementById('hslaValue');

        function updateColor() {
            const hslColor = `hsl(${hue.value}, ${saturation.value}%, ${lightness.value}%)`;
            const hslaColor = `hsla(${hue.value}, ${saturation.value}%, ${lightness.value}%, ${alpha.value})`;

            colorBox.style.backgroundColor = hslColor;
            colorBox.style.opacity = alpha.value; // Set opacity based on the alpha value
            hslValue.textContent = hslColor;
            hslaValue.textContent = hslaColor;
        }

        hue.addEventListener('input', updateColor);
        saturation.addEventListener('input', updateColor);
        lightness.addEventListener('input', updateColor);
        alpha.addEventListener('input', updateColor);

        // Initial update
        updateColor();
