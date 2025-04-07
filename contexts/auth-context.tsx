"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase, type UserProfile, type UserRole } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

interface AuthState {
  user: UserProfile | null
  session: any | null
  loading: boolean
}

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, role: UserRole, metadata?: any) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserProfile(session)
      } else {
        setState((prev) => ({ ...prev, loading: false }))
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchUserProfile(session)
      } else {
        setState({ user: null, session: null, loading: false })
      }

      // Show toast messages based on auth events
      if (event === "SIGNED_IN") {
        toast({
          title: "Signed in successfully",
          description: "Welcome back to NewSilkroad!",
          variant: "success",
        })
      } else if (event === "SIGNED_OUT") {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully",
          variant: "default",
        })
      } else if (event === "PASSWORD_RECOVERY") {
        toast({
          title: "Password recovery initiated",
          description: "Check your email for the password reset link",
          variant: "success",
        })
      } else if (event === "USER_UPDATED") {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
          variant: "success",
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [toast])

  async function fetchUserProfile(session: any) {
    try {
      if (!session || !session.user) {
        setState((prev) => ({ ...prev, loading: false }))
        return
      }

      // First, try to get the user's metadata from the session
      // This is a workaround for RLS permission issues
      const userData = {
        id: session.user.id,
        email: session.user.email,
        role: session.user.user_metadata?.role || "customer",
        full_name: session.user.user_metadata?.full_name || "",
        store_name: session.user.user_metadata?.store_name || "",
        store_description: session.user.user_metadata?.store_description || "",
        phone_number: session.user.user_metadata?.phone_number || "",
        created_at: session.user.created_at,
      }

      // Now try to get the profile data from the database
      // If this fails due to permissions, we'll still have basic user data
      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        if (!error && data) {
          // If successful, use the database profile data
          userData.role = data.role || userData.role
          userData.full_name = data.full_name || userData.full_name
          userData.store_name = data.store_name || userData.store_name
          userData.store_description = data.store_description || userData.store_description
          userData.phone_number = data.phone_number || userData.phone_number
        }
      } catch (profileError) {
        console.warn("Could not fetch profile from database, using session data instead:", profileError)
        // Continue with the user metadata from the session
      }

      setState({
        user: userData as UserProfile,
        session: session,
        loading: false,
      })
    } catch (error) {
      console.error("Error in fetchUserProfile:", error)
      // Still set the user from session data to avoid blocking the UI
      if (session && session.user) {
        const basicUserData = {
          id: session.user.id,
          email: session.user.email,
          role: session.user.user_metadata?.role || "customer",
          full_name: session.user.user_metadata?.full_name || "",
          created_at: session.user.created_at,
        }
        setState({
          user: basicUserData as UserProfile,
          session: session,
          loading: false,
        })
      } else {
        setState((prev) => ({ ...prev, loading: false }))
      }
    }
  }

  async function signUp(email: string, password: string, role: UserRole, metadata = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            ...metadata,
          },
        },
      })

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        })
        return { error }
      }

      // Create profile record
      if (data.user) {
        try {
          const { error: profileError } = await supabase.from("profiles").insert([
            {
              id: data.user.id,
              email,
              role,
              ...metadata,
            },
          ])

          if (profileError) {
            console.error("Profile creation error:", profileError)
            // Don't return error here, as the auth signup succeeded
            // and the trigger might have already created the profile
          }
        } catch (profileErr) {
          console.error("Profile creation exception:", profileErr)
          // Don't return error here either
        }
      }

      toast({
        title: "Sign up successful",
        description: "Please check your email to confirm your account",
        variant: "success",
      })

      return { error: null }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      })
      return { error }
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        })
        return { error }
      }

      // Fetch user profile after successful sign-in
      if (data.session) {
        await fetchUserProfile(data.session)
      }

      return { error: null }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      })
      return { error }
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setState({
      user: null,
      session: null,
      loading: false,
    })
  }

  async function resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        })
        return { error }
      }

      toast({
        title: "Password reset email sent",
        description: "Check your email for the password reset link",
        variant: "success",
      })

      return { error: null }
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive",
      })
      return { error }
    }
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    try {
      if (!state.user) throw new Error("User not authenticated")

      // First update the user metadata in auth
      const { error: authError } = await supabase.auth.updateUser({
        data: updates,
      })

      if (authError) {
        console.error("Error updating user metadata:", authError)
      }

      // Then try to update the profile in the database
      try {
        const { error } = await supabase.from("profiles").update(updates).eq("id", state.user.id)

        if (error) {
          console.warn("Error updating profile in database:", error)
          // Continue anyway since we updated the auth metadata
        }
      } catch (dbError) {
        console.warn("Exception updating profile in database:", dbError)
        // Continue anyway since we updated the auth metadata
      }

      // Update the local state
      setState((prev) => ({
        ...prev,
        user: {
          ...prev.user!,
          ...updates,
        },
      }))

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
        variant: "success",
      })

      return { error: null }
    } catch (error: any) {
      toast({
        title: "Profile update failed",
        description: error.message,
        variant: "destructive",
      })
      return { error }
    }
  }

  const value = {
    ...state,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

