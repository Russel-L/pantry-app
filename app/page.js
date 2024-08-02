"use client"
import { Box, Stack, Typography, Button, Modal, TextField, Search } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import { firestore} from '@/firebase';
import { collection, query, getDocs, setDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  p: 4,
  gap: 2
};

export default function Home() {
  const [pantry, setPantry] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState("");

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const pantryList = []
    docs.forEach(doc => {
      pantryList.push({name: doc.id, ...doc.data()});
    });
    console.log(pantryList);
    setPantry(pantryList);
  }

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    const docRef =  doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const count = docSnap.data().count + 1;
      await setDoc(docRef, {count});
    }
    else {
      await setDoc(docRef, {count: 1});
    }
    await updatePantry();
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.data().count > 1) {
      const count = docSnap.data().count - 1;
      await setDoc(docRef, {count});
    }
    else {
      await deleteDoc(docRef);
    }
    await updatePantry();
  }


  const filterData = (query, data) => {
    if (!query) {
      return data;
    } else {
      return data.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));
    }
  };

  const dataFiltered = filterData(searchQuery, pantry);

  return (
    <Box 
      width="100vw" 
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      gap={2}>
        <TextField 
        id="search" 
        label="Search" 
        variant="outlined" 
        width="100vw" 
        height="100vh"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack direction={"row"} spacing={2}>
              <TextField 
                id="item" 
                label="Item" 
                variant="outlined" 
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button variant="outlined" onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}>
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button variant="contained" onClick={handleOpen}>Add</Button>
        <Box border={"1px solid #333"}>
          <Box width="800px" height="100px" bgcolor={"#ADD8E6"} >
            <Typography variant={"h2"} color={"#333"} textAlign={"center"}>
            Pantry Items
            </Typography>
          </Box>
          <Stack
            width="800px"
            height="300px"
            spacing={2}
            overflow={'auto'}>
            {dataFiltered.map(({name, count}) => (
                <Box
                  key={name}
                  width={"100%"}
                  minHeight={"150px"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  bgcolor={"#f0f0f0"}
                  color={"black"}
                  display={"flex"}
                  paddingX={2}>
                    <Typography 
                      variant={"h3"}
                      color={"#333"}
                      textAlign={'center'}>
                      {
                        name.charAt(0).toUpperCase() + name.slice(1)
                      }
                    </Typography>
                    <Typography
                      variant={"h4"}
                      color={"#333"}
                      textAlign={'center'}>
                      Quantity: {count}
                    </Typography>
                  <Button variant="outlined" onClick={() => removeItem(name)}>Remove</Button>
                </Box>
            ))}
          </Stack>
        </Box>
    </Box>
  );
}
