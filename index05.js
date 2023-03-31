
const canvas = document.getElementById('canvas');
const toolbar = document.getElementById('toolbar');
const addTextButton = document.getElementById('add-text');
const addImageButton = document.getElementById('add-image');

const addVideoButton = document.querySelector('#add-video');

const videoSpeedInput = document.querySelector('.video-speed-input');
const videoSizeInput = document.querySelector('.video-size-input');

const playButton = document.getElementById('play-video');
const pauseButton = document.getElementById('pause-video');

const addColor = document.getElementById('add-color');
const colorPicker = document.getElementById('color-input');
const fontFamilySelect = document.getElementById('font-family-select');
const fontSizeSelect = document.getElementById('font-size-input');

const deleteButton = document.getElementById('delete');


let isPlaying = false;
let videoElement;
let videoElements = [];
let selectedVideo = null;

let selectedElement;



// Delete selected element
deleteButton.addEventListener('click', () => {
    // const elementSelect = document.querySelector('.selected');
    const elementSelect = selectedVideo;
    if (elementSelect) {
        elementSelect.remove();
    }
});

const initCanvas = () => {
    // Set canvas size
    canvas.style.width = '960px';
    canvas.style.height = '540px';
    canvas.style.border = '1px solid black';
    console.log("hello");

    // Make canvas droppable
    interact(canvas).dropzone({
        accept: '.draggable',
        ondrop: event => {
            const element = event.relatedTarget;
            if (element.classList.contains('resizable')) {
                // Resize video to fit canvas if necessary
                if (element.offsetWidth > canvas.offsetWidth) {
                    element.style.width = '100%';
                }
                if (element.offsetHeight > canvas.offsetHeight) {
                    element.style.height = '100%';
                }
            } else if (element.classList.contains('cropbox')) {
                // Crop image to fit canvas
                const cropbox = element.querySelector('.cropbox-image');
                const cropboxRect = cropbox.getBoundingClientRect();
                const canvasRect = canvas.getBoundingClientRect();
                const scaleX = canvas.offsetWidth / cropbox.offsetWidth;
                const scaleY = canvas.offsetHeight / cropbox.offsetHeight;
                const cropX = (cropboxRect.left - canvasRect.left) / scaleX;
                const cropY = (cropboxRect.top - canvasRect.top) / scaleY;
                const cropWidth = canvas.offsetWidth / scaleX;
                const cropHeight = canvas.offsetHeight / scaleY;
                cropbox.style.objectFit = 'none';
                cropbox.style.objectPosition = `-${cropX}px -${cropY}px`;
                cropbox.style.width = `${cropWidth}px`;
                cropbox.style.height = `${cropHeight}px`;
            }
        }
    });
};

// Add text element
addTextButton.addEventListener('click', () => {
    const text = document.createElement('div');
    text.classList.add('draggable');
    text.classList.add('resizable');
    text.style.position = 'absolute';
    // text.style.color = 'black';
    text.style.color = colorPicker.value;
    text.style.fontSize = '24px';
    text.style.fontFamily = 'Arial';
    text.style.padding = '10px';
    text.style.cursor = 'vertical-text';
    // text.style.backgroundColor = 'rgba(0,0,0,0.5)';
    text.textContent = 'Enter text here';
    selectedElement = text.textContent;

    // Make text editable
    text.addEventListener('dblclick', () => {
        text.contentEditable = true;
        text.focus();
    });

    canvas.appendChild(text);

    // Make text element draggable
    interact(text).draggable({
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: 'parent'
            })
        ],
        listeners: {
            start(event) {
                selectedElement = event.target;
                event.target.style.zIndex = 1;
            },
            move(event) {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        }
    });

    // Make text element resizable
    interact(text).resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
            move: event => {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.deltaRect.left;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.deltaRect.top;

                target.style.width = `${event.rect.width}px`;
                target.style.height = `${event.rect.height}px`;
                target.style.transform = `translate(${x}px, ${y}px)`;
            }
        }
    });

    // Add event listeners to buttons
    // Add color picker functionality
    addColor.addEventListener('click', () => {
    });
    colorPicker.addEventListener('input', () => {
        // console.log("hell 1")
        if (selectedElement ) {//&& selectedElement.classList.contains('text')) {
            selectedElement.style.color = colorPicker.value;
        };
    });

    fontFamilySelect.addEventListener('change', () => {
        // console.log("hell 2")
        // const selectedElement = document.querySelector('.selected');
        if (selectedElement) {
            const textElement = selectedElement
            if (textElement) {
                textElement.style.fontFamily = fontFamilySelect.value;
            }
        }
    });

    fontSizeSelect.addEventListener('change', () => {
        // const selectedElement = document.querySelector('.selected');
        if (selectedElement) {
        // console.log("hell 3")
            const textElement = selectedElement
            if (textElement) {
                textElement.style.fontSize = `${fontSizeSelect.value}px`;
            }
        }
    });
});

// Add image element
addImageButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();
    input.addEventListener('change', () => {
        const file = input.files[0];
        const reader = new FileReader();
        // reader.readAsDataURL(file);
        reader.addEventListener('load', () => {
            const image = document.createElement('img');
            const cropbox = document.createElement('div');
            const cropboxImage = document.createElement('div');
            image.src = reader.result;
            image.classList.add('draggable');
            image.classList.add('resizable');
            image.classList.add('cropbox');
            image.classList.add('cropbox-image');

            image.appendChild(cropboxImage);
            image.appendChild(cropbox);
            canvas.appendChild(image);

            interact(image).draggable({
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: 'parent',
                        // endOnly: true
                    })
                ],
                listeners: {
                    start: event => {
                        // Only perform actions on selected element
                        event.target.style.zIndex = 100;
                    },
                    move: event => {
                        const target = event.target;
                        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                        target.style.transform = `translate(${x}px, ${y}px)`;
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    },
                    end: event => {
                        // Only perform actions on selected element
                        event.target.style.zIndex = 100;
                    }
                }
            }).resizable({
                edges: { left: true, right: true, bottom: true, top: true },
                listeners: {
                    start: event => {
                        // Only perform actions on selected element
                        event.target.style.zIndex = 100;
                    },
                    move: event => {
                        const target = event.target;
                        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.deltaRect.left;
                        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.deltaRect.top;

                        target.style.width = `${event.rect.width}px`;
                        target.style.height = `${event.rect.height}px`;
                        target.style.transform = `translate(${x}px, ${y}px)`;
                    },
                    end: event => {
                        // Only perform actions on selected element
                        event.target.style.zIndex = 100;
                    }
                }
            });

            //  Make video elements crop-able
            // interact(image).resizable({
            //     edges: { left: true, right: true, bottom: true, top: true },
            //     listeners: {
            //         start: event => {
            //             // Only perform actions on selected element
            //             event.target.style.zIndex = 100;
            //         },
            //         move: event => {
            //             // Only perform actions on selected element
            //             const target = event.target;
            //             const x = (parseFloat(target.getAttribute('data-x')) || 0);
            //             const y = (parseFloat(target.getAttribute('data-y')) || 0);
            //             const width = event.rect.width;
            //             const height = event.rect.height;
            //             target.style.width = `${width}px`;
            //             target.style.height = `${height}px`;
            //             target.style.transform = `translate(${x}px, ${y}px)`;
            //             target.style.clip = `rect(${y}px, ${x + width}px, ${y + height}px, ${x}px)`;
            //             // target.querySelector('vedio').style.clip = `rect(${y}px, ${x + width}px, ${y + height}px, ${x}px)`;
            //         },
            //         end: event => {
            //             // Only perform actions on selected element
            //             event.target.style.zIndex = 100;
            //         }
            //     }
            // });

        });
        reader.readAsDataURL(file);
    });
});

// Add video element
addVideoButton.addEventListener('click', () => {
    const videoInput = document.createElement('input');
    videoInput.type = 'file';
    videoInput.accept = 'video/*';
    console.log("hell2", videoInput)
    videoInput.click();
    videoInput.addEventListener('change', () => {
        const file = videoInput.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const video = document.createElement('video');
            video.setAttribute('src', reader.result);
            video.setAttribute('controls', 'true');
            video.classList.add('draggable');
            video.classList.add('resizable');
            video.setAttribute('width', videoSizeInput.value * 100);
            // video.setAttribute('width', 100);
            video.setAttribute('height', (videoSizeInput.value * 100));
            // video.setAttribute('height', 100);
            video.playbackRate = videoSpeedInput.value;

            // add event listener for double-click events
            video.addEventListener('dblclick', () => {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    video.requestFullscreen();
                }
            });

            canvas.appendChild(video);
            videoElement = video;
            // Make video elements draggable
            interact(videoElement).draggable({
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: 'parent'
                    })
                ],
                listeners: {
                    start: event => {
                        // Only perform actions on selected element
                        selectedVideo = event.target;
                        event.target.style.zIndex = 100;
                    },
                    move: event => {
                        // Only perform actions on selected element
                        const target = event.target;
                        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                        target.style.transform = `translate(${x}px, ${y}px)`;
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    },
                    end: event => {
                        // Only perform actions on selected element
                        event.target.style.zIndex = 100;
                    }
                }
            });

            // Make video elements resizable
            interact(videoElement).resizable({
                edges: { left: true, right: true, bottom: true, top: true },
                listeners: {
                    start: event => {
                        // Only perform actions on selected element
                        selectedVideo = event.target;
                        event.target.style.zIndex = 100;
                    },
                    move: event => {
                        // Only perform actions on selected element
                        const target = event.target;
                        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.deltaRect.left;
                        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.deltaRect.top;
                        const width = event.rect.width;
                        const height = event.rect.height;
                        target.style.width = `${width}px`;
                        target.style.height = `${height}px`;
                        target.style.transform = `translate(${x}px, ${y}px)`;
                    },
                    end: event => {
                        // Only perform actions on selected element
                        event.target.style.zIndex = 0;
                    }
                }
            });

            // Make video elements crop-able
            // interact(videoElement).resizable({
            //     edges: { left: true, right: true, bottom: true, top: true },
            //     listeners: {
            //         start: event => {
            //             // Only perform actions on selected element
            //             event.target.style.zIndex = 100;
            //         },
            //         move: event => {
            //             // Only perform actions on selected element
            //             const target = event.target;
            //             const x = (parseFloat(target.getAttribute('data-x')) || 0);
            //             const y = (parseFloat(target.getAttribute('data-y')) || 0);
            //             const width = event.rect.width;
            //             const height = event.rect.height;
            //             target.style.width = `${width}px`;
            //             target.style.height = `${height}px`;
            //             target.style.transform = `translate(${x}px, ${y}px)`;
            //             target.style.clip = `rect(${y}px, ${x + width}px, ${y + height}px, ${x}px)`;
            //             // target.querySelector('vedio').style.clip = `rect(${y}px, ${x + width}px, ${y + height}px, ${x}px)`;
            //         },
            //         end: event => {
            //             // Only perform actions on selected element
            //             event.target.style.zIndex = 0;
            //         }
            //     }
            // });

            // Add event listeners to video controls

            // videoElement.addEventListener('mousedown', (event) => {
            //     selectedVideo = video;
            //     const target = event.target;
            //     const videos = document.querySelectorAll('.video');
            //         videos.forEach(video => {
            //             if (video == event.target) {
            //                 console.log("h")
            //                 video.classList.add('selected');
            //             }
            //         });

            //         document.addEventListener('mousedown', () => {
            //             // Select clicked video
            //             vedio.classList.remove('selected');
            //         })

            // Reset input fields
            // videoSpeedInput.value = '';
            // videoSizeInput.value = '';

            // video controlls
            // pause

            // Get the controls element

            // Select video element when clicked
            // interact('.draggable')
            //     .draggable({
            //         listeners: {
            //             start: event => {
            //                 selectedVideo = event.target.parentElement;
            //             }
            //         }
            //     });

            // Change video speed when slider is moved
            videoSpeedInput.addEventListener('input', () => {
                if (selectedVideo !== null) {
                    selectedVideo.playbackRate = videoSpeedInput.value;
                }
            });

            // Change video size when slider is moved
            videoSizeInput.addEventListener('input', (event) => {
                if (selectedVideo !== null) {
                    selectedVideo.style.width = `${(event.target.value) * 100}%`;
                    selectedVideo.style.height = 'auto';
                    // target.style.width = `${videoSizeInput.value * 10}px`;
                    // target.style.height = `${videoSizeInput.value * 10}px`;
                    // selectedVideo.style.transform = `scale(${videoSizeInput.value})`;
                }
            });

            // Play selected video when button is clicked
            playButton.addEventListener('click', () => {
                if (selectedVideo !== null) {
                    selectedVideo.play();
                }
            });

            // Pause selected video when button is clicked
            pauseButton.addEventListener('click', () => {
                if (selectedVideo !== null) {
                    selectedVideo.pause();
                }
            });

        };
    });
});

initCanvas();