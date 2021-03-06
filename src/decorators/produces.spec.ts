import {assert} from 'chai';
import { Observable } from 'rxjs';
import { Http, Request, Response, ResponseOptions } from '@angular/http';
import { RestClient } from '../rest-client';
import { Get } from './request-methods';
import { Map } from './map';
import { Produces, MediaType } from './produces';

describe('@Produces', () => {

  it('verify Produces function is called', (done: (e?: any) => void) => {
    // Arrange
    let requestMock = new HttpMock((req: Request) => {
      let json:any = {name: 'itemName', desc: 'Some awesome item'};
      return Observable.of(new Response(new ResponseOptions({body: JSON.stringify(json)})));
    });
    let testClient = new TestClient(requestMock);

    // Act
    let result = testClient.getItems();

    // Assert
    result.subscribe(item => {
      try {
        assert.equal( item['name'], 'itemName' );
        assert.equal( item['desc'], 'Some awesome item' );
        done();
      } catch(e) {
        done(e);
      }
    });
  });
});

class HttpMock extends Http {

  public callCount:number = 0;
  public lastRequest:Request;

  constructor(private requestFunction: (req: Request) => Observable<Response>) {
    super(null, null);
  }

  public request(req: Request): Observable<Response> {
    this.callCount++;
    this.lastRequest = req;
    return this.requestFunction(req);
  }
}

class TestClient extends RestClient {

  @Get('/test')
  @Produces(MediaType.JSON)
  public getItems(): Observable<{}> {
    return null;
  }

}
