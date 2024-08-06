"use client";
import Image from "next/image";
import { useState, useEffect, useMemo, useRef } from "react";
import { firestore, auth } from "@/firebase";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Modal,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Camera as CameraIcon,
  Search as SearchIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";

import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { Camera } from "react-camera-pro";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Login } from "./components/Login";


export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);

  // const [cameraOpen, setCameraOpen] = useState(false);
  // const [image, setImage] = useState(null);
  // const cameraRef = useRef(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        updateInventory(currentUser.uid);
      } else {
        setUser(null);
        setInventory([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventory, searchTerm]);

  const updateInventory = async (userId) => {
    try {
      const inventoryRef = collection(firestore, "users", userId, "inventory");
      const snapshot = await getDocs(inventoryRef);
      const inventoryList = snapshot.docs.map((doc) => ({
        name: doc.id,
        ...doc.data(),
      }));
      setInventory(inventoryList);
      console.log("Inventory updated:", inventoryList);
    } catch (error) {
      console.error("Error updating inventory:", error);
      if (error.code === "permission-denied") {
        console.log("Current user UID:", auth.currentUser?.uid);
        console.log("Attempted to access inventory for user:", userId);
      }
    }
  };

  const addItem = async (item) => {
    if (!user) return;
    const docRef = doc(firestore, `users/${user.uid}/inventory`, item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory(user.uid);
  };

  const removeItem = async (item) => {
    if (!user) return;
    const docRef = doc(firestore, `users/${user.uid}/inventory`, item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory(user.uid);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const handleCameraOpen = () => setCameraOpen(true);
  // const handleCameraClose = () => setCameraOpen(false);

  // const captureImage = () => {
  //   const image = cameraRef.current.takePhoto();
  //   setImage(image);
  //   handleCameraClose();
  // };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.log("Error logging out user: ", error);
    }
  };

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {!user ? (
        <Login />
      ) : (
        <>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Pantry Tracker
              </Typography>
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </Toolbar>
          </AppBar>

          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <List>
                <ListItem
                  button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpen();
                  }}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add New Item" />
                </ListItem>
                {/* <ListItem
                  button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCameraOpen();
                  }}
                >
                  <ListItemIcon>
                    <CameraIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add Item with Camera" />
                </ListItem> */}
              </List>
              <Divider />
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <InventoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Inventory" />
                </ListItem>
              </List>
            </Box>
          </Drawer>
          <Modal open={open} onClose={handleClose}>
            <Box
              position="absolute"
              top="50%"
              left="50%"
              width={400}
              bgcolor="white"
              border="2px solid #000"
              boxShadow={24}
              p={4}
              display="flex"
              flexDirection="column"
              gap={3}
              sx={{
                transform: "translate(-50%, -50%)",
              }}
            >
              <Typography variant="h6">Add Item</Typography>
              <Stack width="100%" direction="row" spacing={2}>
                <TextField
                  variant="outlined"
                  fullWidthvalue={itemName}
                  value={itemName}
                  onChange={(e) => {
                    setItemName(e.target.value);
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={() => {
                    addItem(itemName);
                    setItemName("");
                    handleClose();
                  }}
                >
                  Add
                </Button>
              </Stack>
            </Box>
          </Modal>
          {/* <Modal open={cameraOpen} onClose={handleCameraClose}>
            <Box
              position="absolute"
              top="50%"
              left="50%"
              width={800}
              height={600}
              bgcolor="white"
              border="2px solid #000"
              boxShadow={24}
              p={4}
              display="flex"
              flexDirection="column"
              gap={3}
              sx={{
                transform: "translate(-50%, -50%)",
              }}
            >
              <Typography variant="h6">Take a picture of the item</Typography>
              <Camera ref={cameraRef} />
              <Button variant="contained" onClick={captureImage}>
                Capture
              </Button>
            </Box>
          </Modal> */}

          <Box sx={{ p: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search Inventory"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" />,
              }}
              sx={{ mb: 3 }}
            />

            <Grid container spacing={3}>
              {filteredInventory.map(({ name, quantity }) => (
                <Grid item xs={12} sm={6} md={4} key={name}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        Quantity: {quantity}
                      </Typography>
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => addItem(name)}
                        >
                          Add
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => removeItem(name)}
                        >
                          Remove
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
    </Box>
  );
}
