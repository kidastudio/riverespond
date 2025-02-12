window.addEventListener("load", () => {
    // Main canvas Rive instance
    const riveInstance = new rive.Rive({
        src: "kidaheroflex.riv",
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
    window
        .matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
        .addEventListener("change", computeSize);

    // Array of Rive file names for the boxes
    const riveFiles = [
        "delonge.riv",
        "dummy1.riv",
        "dummy2.riv",
        "dummy3.riv",
        "dummy4.riv",
        "dummy5.riv",
        "dummy6.riv",
        "dummy7.riv",
        "dummy8.riv"
    ];

    // Initialize Rive animations for each box using files from the array (cycle if needed)
    const riveBoxes = document.querySelectorAll('.rive-box');
    riveBoxes.forEach((canvas, index) => {
        // Use modulo in case there are more boxes than files
        const fileSrc = riveFiles[index % riveFiles.length];

        const riveAnimation = new rive.Rive({
            src: fileSrc,
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

        // Set the box title as the file name.
        const titleElement = canvas.parentElement.querySelector('.box-overlay .box-title');
        if (titleElement) {
            titleElement.textContent = fileSrc;
        }

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

        // Play animation on mouse hover and pause on mouse leave.
        canvas.addEventListener("mouseenter", () => {
            riveAnimation.play();
        });
        canvas.addEventListener("mouseleave", () => {
            riveAnimation.pause();
        });

        window.addEventListener('resize', () => resizeCanvas(canvas, riveAnimation));
    });
});