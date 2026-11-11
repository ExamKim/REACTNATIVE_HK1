import React, { useState } from 'react';
import { Button, View } from 'react-native';
import Bai9 from './src/Bai9';
import Bai10 from './src/Bai10';
import Bai11 from './src/Bai11';
import Bai12 from './src/Bai12';
import Bai13 from './src/Bai13';
import Bai14 from './src/Bai14';
import Bai15 from './src/Bai15';

export default function App() {
  const [currentBai, setCurrentBai] = useState<number>(9);

  const renderScreen = () => {
    switch (currentBai) {
      case 9:
        return <Bai9 />;
      case 10:
        return <Bai10 />;
      case 11:
        return <Bai11 />;
      case 12:
        return <Bai12 />;
      case 13:
        return <Bai13 />;
      case 14:
        return <Bai14 />;
      case 15:
        return <Bai15 />;
      default:
        return <Bai9 />;
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {[9, 10, 11, 12, 13, 14, 15].map((bai) => (
          <Button key={bai} title={`Bài ${bai}`} onPress={() => setCurrentBai(bai)} />
        ))}
      </View>
      <View style={{ flex: 1 }}>{renderScreen()}</View>
    </View>
  );
}
