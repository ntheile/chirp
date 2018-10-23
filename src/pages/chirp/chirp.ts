import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { GoogleNearby } from '@ionic-native/google-nearby';
import { ToastController } from 'ionic-angular';
import * as moment from 'moment';
import { Attendee } from './../../models/attendee';
import 'rxjs/add/operator/toPromise';
import { GithubProvider } from './../../providers/github/github';
declare let ChirpConnectSDK: any;
declare let d3: any;
declare let $: any;
declare let window: any;

@IonicPage()
@Component({
  selector: 'page-chirp',
  templateUrl: 'chirp.html',
})
export class ChirpPage {

  account;
  name = "";
  attendees;
  attendeeCount = 0;
  nearbySub;
  public attendeeList = [] as Array<Attendee>;
  graph;
  myGraph;
  showCount = false;
  eventName = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public googleNearby: GoogleNearby,
    public platform: Platform,
    private toastCtrl: ToastController,
    private github : GithubProvider,
  ) {
    this.registerNearbyLifecycle();
    //let a = {} as Attendee;
    // a.name = 'n';
    // a.time = this.now();
    // a.publicAddress ='this.account.address';
    // this.attendeeList.push(a);
    // this.attendeeList.push({name:'b', time: '1', publicAddress: '11'});
    window.attendees = 0;
  }

//   ionViewDidLoad() {
//     this.setupNearby();
//     this.chirp();
//   }


  async submitAttendanceListToBlockChain() {
    // ETH
    // https://stackoverflow.com/questions/48184969/calling-smart-contracts-methods-using-web3-ethereum

    // EOS
  }

  ionViewDidLeave() {
    if (this.platform.is('cordova')) {
      this.nearbySub.unsubscribe();
    }
  }

  registerNearbyLifecycle() {
    this.platform.ready().then(() => {
      // When app pauses, unsubscripbe from nearby
      this.platform.pause.subscribe(() => {
        console.log('MessagePage App paused');
        try {
          this.ionViewDidLeave();
        }
        catch (e) { }
      });
      // When app resumes subscribe to nearby
      this.platform.resume.subscribe(() => {
        console.log('MessagePage App resume');
        this.setupNearby();
      });
    });
  }

  setupNearby() {
    this.toast('Listening for nearby attendees...');
    if (this.platform.is('cordova')) {
      // Get Data
      this.nearbySub = this.googleNearby.subscribe().subscribe(result => {
        result = result.replace(/\\/g, "");
        result = result.substring(1, result.length - 1);
        console.log(result);
        this.toast(result);
        let a = JSON.parse(result);
        // this.bal = this.bal + 1;
        // localStorage.setItem('bal', this.bal.toString());
        this.attendeeList.push(a);
      });
    }
  }

  sendAttendanceGossip() {

    if (this.name !== "") {
      localStorage.setItem('name', this.name);
    }

    let attendee = {
      name: this.name,
      time: this.now(),
      publicAddress: this.account.address
    }

    if (this.platform.is('cordova')) {

      // let msg = now + ' Hello I am ';
      // if (this.name) {
      //   msg = msg + this.name + " - ";
      // }
      // msg = msg + this.account.address;

      this.googleNearby.publish(JSON.stringify(attendee))
        .then((res: any) => {
          let msg = this.name + " sent message to nearby attendees!";
          this.toast(msg)
        })
        .catch((error: any) => alert("Error" + error));
    }
  }

  toast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 6000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  itemSelected(item) {

  }

  now() {
    return moment().format('MMMM Do YYYY, h:mm:ss a');
  }


  chirp() {

    const { Chirp } = ChirpConnectSDK;
    // setTimeout( ()=>{
    //   this.setupD3();
    // }, 300 );
    var myName = "Nick";
    Chirp({
      key: 'B8dB7210eC0fFEB3FC7A8cD8E',
      onStateChanged: (previous, current) => {
        console.log(current)
      },
      onReceived: data => {
        if (data.length > 0) {
          var d = String.fromCharCode.apply(null, data);
          var msg = new SpeechSynthesisUtterance('Hey alexa, hello');
          window.speechSynthesis.speak(msg);
          console.log(data);
          window.graph.addNode(d);
          this.github.postIssue('DowHackathon2018', d);
          // this.drawGraph();
        }
      }
    }).then(sdk => {
      sdk.send([0, 1, 2, 3]);
    }).catch(console.error)

  }


  setupD3() {
    //this.setupNearby();
    this.showCount = true;

    $("#attendCnt").html("0 attendees");

    var graph;

    function myGraph(id) {
        var width = screen.width;
        var height = screen.height * 0.4;
        var radius = 12;
        var minPath = 20;
        var self = this;

        // Add and remove elements on the graph object
        this.addNode = function (id) {
            nodes.push({"id": id});
            update();
            this.attendeeCount += 1;
        };

        this.addNodeToRoot = function(id) {
            nodes.push({"id": id});
            links.push({"source": findNode(id), "target": nodes[0], "value": (minPath + Math.random()*20).toString()});
            update();
            keepNodesOnTop();
        }

        this.countNodes = function() {
          return $( $(d3.select("svg")[0][0]).children('g')[0] ).children('g').length;
        }

        this.removeNode = function (id) {
            var i = 0;
            var n = findNode(id); // loop through to find id
            while (i < links.length) {
                if ((links[i]['source'] == n) || (links[i]['target'] == n)) {
                    links.splice(i, 1);
                }
                else i++;
            }
            nodes.splice(findNodeIndex(id), 1);
            update();
        };

        this.removeLink = function (source, target) {
            for (var i = 0; i < links.length; i++) {
                if (links[i].source.id == source && links[i].target.id == target) {
                    links.splice(i, 1);
                    break;
                }
            }
            update();
        };

        this.removeallLinks = function () {
            links.splice(0, links.length);
            update();
        };

        this.removeAllNodes = function () {
            nodes.splice(0, links.length);
            update();
        };

        this.addLink = function (source, target, value) {
            links.push({"source": findNode(source), "target": findNode(target), "value": value});
            update();
            keepNodesOnTop();
        };

        var findNode = function (id) {
            for (var i in nodes) {
                if (nodes[i]["id"] === id) return nodes[i];
            };
        };

        var findNodeIndex = function (id) {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].id == id) {
                    return i;
                }
            }
            ;
        };

        // set up the D3 visualisation in the specified element
        var color = d3.scale.category10();

        var vis = d3.select("#svgdiv")
                .append("svg:svg")
                .attr("width", width)
                .attr("height", height)
                .attr("id", "svg")
                .attr("pointer-events", "all")
                .attr("viewBox", "0 0 " + width + " " + height)
                .attr("perserveAspectRatio", "xMinYMid")
                .append('svg:g');

        var force = d3.layout.force();

        var nodes = force.nodes(),
                links = force.links();

        var update = function () {

            var link = vis.selectAll("line")
                    .data(links, function (d) {
                        return d.source.id + "-" + d.target.id;
                    });

            link.enter().append("line")
                    .attr("id", function (d) {
                        return d.source.id + "-" + d.target.id;
                    })
                    .attr("stroke-width", function (d) {
                        return d.value / 10;
                    })
                    .style("stroke", "#ccc")
                    .attr("class", "link");
            link.append("title")
                    .text(function (d) {
                        return d.value;
                    });
            link.exit().remove();

            var node = vis.selectAll("g.node")
                    .data(nodes, function (d) {
                        return d.id;
                    });

            var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .call(force.drag);

            nodeEnter.append("svg:circle")
                    .attr("r", radius)
                    .attr("id", function (d) {
                        return "Node;" + d.id;
                    })
                    .attr("class", "nodeStrokeClass")
                    .attr("fill", function(d) { return color(d.id); });

            nodeEnter.append("svg:text")
                    .attr("class", "textClass")
                    .attr("x", 14)
                    .attr("y", ".31em")
                    .text(function (d) {
                        return d.id;
                    });

            node.exit().remove();

            force.on("tick", function () {

                node.attr("transform", function (d) {
                    d.x = Math.max(radius, Math.min(width - radius, d.x));
                    d.y = Math.max(radius, Math.min(height - radius, d.y));
                    return "translate(" + d.x + "," + d.y + ")";
                });

                link.attr("x1", function (d) {
                    return d.source.x;
                })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });
            });

            // Restart the force layout.
            force
                    .gravity(.01)
                    .charge(-80000)
                    .friction(0)
                    .linkDistance( function(d) { return d.value * 10 } )
                    .size([width, height])
                    .start();
            try{
              $("#attendCnt").html(window.graph.countNodes() + " attendees");
            }
            catch(e){}


        };


        // Make it all go
        update();
    }

    var self = this;

    function drawGraph(root: string) {
        var minPath = 20;
        graph = new myGraph("#svgdiv");
        graph.addNode(root);
        graph.addNode('Sophia');
        graph.addNode('Daniel');
        graph.addNode('Ryan');
        graph.addLink(root,'Sophia',(minPath + Math.random()*20).toString());
        graph.addLink(root,'Daniel',(minPath + Math.random()*20).toString());
        graph.addLink(root,'Ryan',(minPath + Math.random()*20).toString());
      
        keepNodesOnTop();      

        window.graph = graph;

        $("#attendCnt").html(graph.countNodes() + " attendees");
    }

    drawGraph(this.eventName);

    this.attendeeCount = graph.countNodes();

    // because of the way the network is created, nodes are created first, and links second,
    // so the lines were on top of the nodes, this just reorders the DOM to put the svg:g on top
    function keepNodesOnTop() {
        $(".nodeStrokeClass").each(function( index ) {
            var gnode = this.parentNode;
            gnode.parentNode.appendChild(gnode);
        });
    }

    function addNodes() {
        d3.select("svg")
                .remove();

         drawGraph(this.eventName);
    }


  }


}
