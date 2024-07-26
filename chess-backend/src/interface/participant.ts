export interface Participant {
    roomId: number;
    userId: number;
    socketId: string;
    joinedAt: Date;
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    profilePicture: string;
    createdAt: Date;
    updatedAt: Date;
    
  }