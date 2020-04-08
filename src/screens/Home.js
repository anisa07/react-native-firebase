import React, {useState, useEffect} from 'react';
import {FlatList, Image, StyleSheet, SafeAreaView} from 'react-native';
import {Appbar, List} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

class Item extends React.Component {
  state = {
    uri: '',
  };

  async componentDidMount() {
    const reference = storage().ref(this.props.url);
    const uri = await reference.getDownloadURL();

    this.setState({
      uri: uri,
    });
  }

  render() {
    const {title, category} = this.props;
    const {uri} = this.state;

    if (!uri) {
      return null;
    }

    return (
      <List.Item
        title={title}
        description={category}
        left={() => (
          <Image
            style={styles.image}
            source={{
              uri,
            }}
          />
        )}
      />
    );
  }
}

function HomeScreen() {
  const ref = firestore().collection('goods');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        list.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setItems(list);

      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  return (
    <>
      <SafeAreaView>
        <Appbar>
          <Appbar.Content title={'FOOD List'} />
        </Appbar>
      </SafeAreaView>
      <FlatList
        style={styles.list}
        data={items}
        keyExtractor={item => item.id}
        renderItem={({item}) => <Item {...item} />}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  image: {
    width: 150,
    height: 100,
  },
});

export default HomeScreen;
