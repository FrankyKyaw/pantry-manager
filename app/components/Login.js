import React from "react";
import { auth, provider, signInWithPopup, signOut } from "@/firebase";
import { 
    Button, 
    Card, 
    CardContent, 
    Typography, 
    Box,
    Avatar
  } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';


export function Login({ setUser }) {
  const handleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      setUser(res.user);
    } catch (error) {
      console.log("Error logging in user: ", error);
    }
}

    const handleLogout = async () => {
      try {
        await signOut(auth);
        setUser(null);
      } catch (error) {
        console.log("Error logging out user: ", error);
      }
    };
    return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Card elevation={3} sx={{ maxWidth: 400, width: '100%', p: 3 }}>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5" gutterBottom>
                  Sign in
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<GoogleIcon />}
                  onClick={handleLogin}
                  fullWidth
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign in with Google
                </Button>
                <Typography variant="body2" color="text.secondary" align="center">
                  By signing in, you agree to our Terms of Service and Privacy Policy.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      );
  };
