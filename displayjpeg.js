import {Node} from "nodered";
import JPEG from "commodetto/readJPEG";
import Poco from "commodetto/Poco";
let xoffset, yoffset;

class DisplayJpeg extends Node {
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

        let decoder = new JPEG(msg.payload);
        let block;
        while (block = decoder.read()) {
             poco.begin(block.x + xoffset, block.y + yoffset, block.width, block.height);
             poco.drawBitmap(block, block.x + xoffset, block.y + yoffset);
             poco.end();
        }
        done();
    };
    static type = "mcu_displayjpeg";
    static {
         RED.nodes.registerType(this.type, this)
    };
};

