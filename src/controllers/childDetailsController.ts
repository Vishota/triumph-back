// src/controllers/childDetailsController.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { db } from '../database';

export function updateChildDetails(req: AuthRequest, res: Response) {
  const { name, surname, birthDate } = req.body;
  if (!name || !surname || !birthDate) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  // проверка, что этот ребёнок принадлежит текущему юзеру
  const child = db
    .prepare('SELECT id FROM children WHERE id = ? AND userId = ?')
    .get(req.body.childId, req.userId);
  if (!child) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  db.prepare(
    'UPDATE children SET firstName = ?, lastName = ?, birthDate = ? WHERE id = ?'
  ).run(name, surname, birthDate, req.body.childId);
  res.sendStatus(200);
}
