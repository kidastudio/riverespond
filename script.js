window.addEventListener("load", () => {
    // Main canvas Rive instance Hero animation.
    const riveInstance = new rive.Rive({
        src: "rive-files/kidaheroflex.riv",
        autoplay: true,
        canvas: document.getElementById('rive'),
        layout: new rive.Layout({
            fit: rive.Fit.Layout,
            alignment: rive.Alignment.Center
        }),
        stateMachines: ["State Machine 1"],
        onLoad: () => {
            computeSize();
        }
    });

    function computeSize() {
        riveInstance.resizeDrawingSurfaceToCanvas();
    }

    window.onresize = computeSize;
    window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
          .addEventListener("change", computeSize);

    // Fetch the boxes JSON data and generate 9 boxes dynamically.
    fetch("boxes.json")
        .then(response => response.json())
        .then(boxesData => {
            // Get the grid container as defined in your index.html.
            const grid = document.querySelector('.grid');
            // Clear previous content (if any).
            grid.innerHTML = '';

            boxesData.forEach((box, index) => {
                // Create the box element.
                const boxElem = document.createElement('div');
                boxElem.classList.add('box');

                // Create the canvas for the Rive animation.
                const canvas = document.createElement('canvas');
                canvas.classList.add('rive-box');
                canvas.id = `rive${index + 1}`;
                boxElem.appendChild(canvas);

                // Create the overlay container for title and description.
                const overlay = document.createElement('div');
                overlay.classList.add('box-overlay');

                // Title from file name (remove .riv extension)
                const titleEl = document.createElement('h3');
                titleEl.classList.add('box-title');
                // As JSON now contains only the file name, simply remove the .riv extension.
                titleEl.textContent = box.file.replace('.riv', '');
                overlay.appendChild(titleEl);

                // Description from JSON.
                const descEl = document.createElement('p');
                descEl.classList.add('box-description');
                descEl.textContent = box.description;
                overlay.appendChild(descEl);

                boxElem.appendChild(overlay);
                // Append the box element to the grid.
                grid.appendChild(boxElem);

                // Initialize the Rive animation on the canvas.
                const riveAnimation = new rive.Rive({
                    // Append the folder path to the file name.
                    src: "rive-files/" + box.file,
                    autoplay: true,
                    canvas: canvas,
                    layout: new rive.Layout({
                        fit: rive.Fit.Cover,
                        alignment: rive.Alignment.Center
                    }),
                    stateMachines: ["Main Machine"],
                    onLoad: () => {
                        resizeCanvas(canvas, riveAnimation);
                    }
                });

                // Function to resize the canvas.
                function resizeCanvas(canvas, riveInstance) {
                    const dpr = window.devicePixelRatio || 1;
                    canvas.width = canvas.clientWidth * dpr;
                    canvas.height = canvas.clientHeight * dpr;
                    const ctx = canvas.getContext('2d');
                    ctx.scale(dpr, dpr);
                    riveInstance.resizeDrawingSurfaceToCanvas();
                }

                // Pause the animation initially.
                riveAnimation.pause();

                // Toggle play on hover.
                canvas.addEventListener("mouseenter", () => {
                    riveAnimation.play();
                });
                canvas.addEventListener("mouseleave", () => {
                    riveAnimation.pause();
                });
                window.addEventListener('resize', () => resizeCanvas(canvas, riveAnimation));

                // Add click event on box to open popup with current Rive animation.
                boxElem.addEventListener("click", () => {
                    // Create the popup container.
                    const popup = document.createElement("div");
                    popup.classList.add("popup");

                    // Popup content with a close button and canvas.
                    popup.innerHTML = `
                        <div class="popup-content">
                            <span class="close">&times;</span>
                            <canvas id="popup-canvas"></canvas>
                        </div>
                    `;
                    document.body.appendChild(popup);

                    // Close popup when 'x' is clicked.
                    popup.querySelector(".close").addEventListener("click", () => {
                        document.body.removeChild(popup);
                    });

                    // Initialize a new Rive animation on the popup canvas.
                    const popupCanvas = popup.querySelector("#popup-canvas");
                    const popupRive = new rive.Rive({
                        src: "rive-files/" + box.file,
                        autoplay: true,
                        canvas: popupCanvas,
                        layout: new rive.Layout({
                            fit: rive.Fit.Contain,
                            alignment: rive.Alignment.Center
                        }),
                        stateMachines: ["Main Machine"],
                        onLoad: () => {
                            resizePopupCanvas(popupCanvas, popupRive);
                        }
                    });

                    function resizePopupCanvas(canvas, riveInstance) {
                        const dpr = window.devicePixelRatio || 1;
                        canvas.width = canvas.clientWidth * dpr;
                        canvas.height = canvas.clientHeight * dpr;
                        const ctx = canvas.getContext('2d');
                        ctx.scale(dpr, dpr);
                        riveInstance.resizeDrawingSurfaceToCanvas();
                    }
                    window.addEventListener('resize', () => resizePopupCanvas(popupCanvas, popupRive));
                });
            });
        })
        .catch(error => console.error("Error loading boxes data:", error));

    // Initialize Rive animation for the logo.
    const logoCanvas = document.getElementById('logo-animation');
    if (logoCanvas) {
        const logoAnimation = new rive.Rive({
            src: 'rive-files/logo.riv', // Update with your logo file.
            autoplay: true,
            canvas: logoCanvas,
            layout: new rive.Layout({
                fit: rive.Fit.Contain,
                alignment: rive.Alignment.Center
            }),
            // stateMachines: ["yourStateMachineName"], // Uncomment/update as needed.
        });

        function resizeLogo() {
            const dpr = window.devicePixelRatio || 1;
            logoCanvas.width = logoCanvas.clientWidth * dpr;
            logoCanvas.height = logoCanvas.clientHeight * dpr;
            const ctx = logoCanvas.getContext('2d');
            ctx.scale(dpr, dpr);
            logoAnimation.resizeDrawingSurfaceToCanvas();
        }

        window.addEventListener('resize', resizeLogo);
        resizeLogo();
    }
});