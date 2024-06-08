import {Node} from "nodered";
import PNG from "commodetto/readPNG";
import Poco from "commodetto/Poco";
import Bitmap from "commodetto/Bitmap";
import Convert from "commodetto/Convert";
import config from "mc/config";
let xoffset, yoffset;

class DisplayPng extends Node {
    onStart(config) {
        super.onStart(config);
        xoffset = Number(config.xoffset);
        yoffset = Number(config.yoffset);
        //console.log("xoffset,yoffset:"+xoffset+","+yoffset);
    };
    onMessage(msg, done) {
        let poco = new Poco(screen);
        let gray = poco.makeColor(0, 0, 0);
        poco.begin();
        poco.fillRectangle(gray, 0, 0, poco.width, poco.height);
        poco.end();

        const png = new PNG(msg.payload);
        const width = png.width, height = Math.min(png.height, poco.height), channels = png.channels;

        if ((8 !== png.depth) || ((3 !== channels) && (4 !== channels)) || png.palette)
            return;

        const pixelFormat = Bitmap[config.format];
        const convert = new Convert((3 == channels) ? Bitmap.RGB24 : Bitmap.RGBA32, pixelFormat);
        const scanOut = new ArrayBuffer((width * Bitmap.depth(pixelFormat)) >> 3);
        let bits;
        if ((0 === config.rotation) || (180 == config.rotation))
                bits = new Bitmap(width, 1, pixelFormat, scanOut, 0);
        else
                bits = new Bitmap(1, width, pixelFormat, scanOut, 0);
        const reverse = (config.rotation >= 180) ? new Uint16Array(scanOut) : undefined;

        poco.begin();
        poco.fillRectangle(gray, 0, 0, poco.width, poco.height);;
        poco.end(); 

        for (let y = 0; y < height; y++) {
                convert.process(png.read().buffer, scanOut);

                reverse?.reverse();

                poco.begin(0 + xoffset, y + yoffset, width, 1);
                poco.drawBitmap(bits, 0 + xoffset, y + yoffset);
                poco.end();
        }
        done();
    };
    static type = "mcu_displaypng";
    static {
         RED.nodes.registerType(this.type, this)
    };
};

