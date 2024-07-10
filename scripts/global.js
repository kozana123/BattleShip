//משתנים גלובליים שזמינים בכל שלבי התוכנית
export const global = {
  size: 0,
  s2: 0,
  s3: 0,
  s4: 0, 
  s5: 0,
  board: null,
  ships: new Array(),
  shipsHealth: new Array(),
  shipCounter: 0,
  isVertical: true,

  cantVertical: false,
  cantHorizontal: false,
  couldntFindAPlace: false,
  notEnoughtSpaceMsg: "Couldn't find a place for: "
  
}