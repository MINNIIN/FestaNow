declare module 'react-native-snap-carousel' {
    import { Component } from 'react';
    
    export type CarouselProps<T> = {
      data: T[];
      renderItem: (info: { item: T; index: number }) => JSX.Element;
      sliderWidth: number;
      itemWidth: number;
      onSnapToItem?: (index: number) => void;
      autoplay?: boolean;
      autoplayInterval?: number;
      loop?: boolean;
      enableMomentum?: boolean;
      lockScrollWhileSnapping?: boolean;
    };
  
    export default class Carousel<T> extends Component<CarouselProps<T>> {}
  }
  