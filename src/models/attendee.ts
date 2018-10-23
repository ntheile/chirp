import { DateTime } from "../../node_modules/ionic-angular/umd";

/**
 * A generic model that our Master-Detail pages list, create, and delete.
 *
 * Change "Item" to the noun your app will use. For example, a "Contact," or a
 * "Customer," or an "Animal," or something like that.
 *
 * The Items service manages creating instances of Item, so go ahead and rename
 * that something that fits your app as well.
 */
export class Attendee {


  public name: string;
  public time: string;
  public publicAddress: string;

  constructor() {
   
  }

}

