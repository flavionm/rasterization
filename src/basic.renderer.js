(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = global || self, factory(global.BasicRenderer = {}));
}(this, (function (exports) {
    'use strict';


    /* ------------------------------------------------------------ */



    function inside(x, y, primitive) {
        // You should implement your inside test here for all shapes
        // for now, it only returns a false test

        return true
    }


    function Screen(width, height, scene) {
        this.width = width;
        this.height = height;
        this.scene = this.preprocess(scene);
        this.createImage();
    }

    Object.assign(Screen.prototype, {

        preprocess: function (scene) {
            // Possible preprocessing with scene primitives, for now we don't change anything
            // You may define bounding boxes, convert shapes, etc

            for (const primitive of scene) {
                const boundingBox = {lowerX: Infinity, upperX: 0, lowerY: Infinity, upperY: 0}
                for (const vertice of primitive.vertices) {
                    const x = vertice[0]
                    const y = vertice[1]
                    if (x < boundingBox.lowerX) boundingBox.lowerX = x
                    if (x > boundingBox.upperX) boundingBox.upperX = x
                    if (y < boundingBox.lowerY) boundingBox.lowerY = y
                    if (y > boundingBox.upperY) boundingBox.upperY = y
                }
                primitive.boundingBox = boundingBox
            }

            return scene;
        },

        createImage: function () {
            this.image = nj.ones([this.height, this.width, 3]).multiply(255);
        },

        rasterize: function () {
            var color;

            // In this loop, the image attribute must be updated after the rasterization procedure.
            for (var primitive of this.scene) {

                // Loop through all pixels
                // Use bounding boxes in order to speed up this loop
                for (var i = primitive.boundingBox.lowerX; i <= primitive.boundingBox.upperX; i++) {
                    var x = i + 0.5;
                    for (var j = primitive.boundingBox.lowerY; j <= primitive.boundingBox.upperY; j++) {
                        var y = j + 0.5;

                        // First, we check if the pixel center is inside the primitive
                        if (inside(x, y, primitive)) {
                            // only solid colors for now
                            color = nj.array(primitive.color);
                            this.set_pixel(i, this.height - (j + 1), color);
                        }

                    }
                }
            }



        },

        set_pixel: function (i, j, colorarr) {
            // We assume that every shape has solid color

            this.image.set(j, i, 0, colorarr.get(0));
            this.image.set(j, i, 1, colorarr.get(1));
            this.image.set(j, i, 2, colorarr.get(2));
        },

        update: function () {
            // Loading HTML element
            var $image = document.getElementById('raster_image');
            $image.width = this.width; $image.height = this.height;

            // Saving the image
            nj.images.save(this.image, $image);
        }
    }
    );

    exports.Screen = Screen;

})));
