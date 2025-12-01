import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
    private socket: Socket | null = null;

    connect(url = 'http://localhost:3000') {
        if (!this.socket) {
            this.socket = io(url, { autoConnect: true });
        }
    }

    disconnect() {
        this.socket?.disconnect();
        this.socket = null;
    }

    // create a room (returns gameId via callback)
    createRoom(): Promise<{ gameId: string } | { error: string }> {
        return new Promise((resolve) => {
            this.socket?.emit('createRoom', (resp: any) => resolve(resp));
        });
    }

    joinRoom(gameId: string): Promise<any> {
        return new Promise((resolve) => {
            this.socket?.emit('joinRoom', { gameId }, (resp: any) => resolve(resp));
        });
    }

    // Send a player move
    sendMove(gameId: string, index: number): Promise<any> {
        return new Promise((resolve) => {
            this.socket?.emit('playerMove', { gameId, index }, (resp: any) => resolve(resp));
        });
    }

    // Observables for server events
    onStartGame(): Observable<any> {
        return new Observable(observer => {
            this.socket?.on('startGame', (data: any) => observer.next(data));
            return () => this.socket?.off('startGame');
        });
    }

    onGameState(): Observable<any> {
        return new Observable(observer => {
            this.socket?.on('gameState', (data: any) => observer.next(data));
            return () => this.socket?.off('gameState');
        });
    }
}
