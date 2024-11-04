// NPM Packages
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";
import { Roles } from "src/shared /enums";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Document {
   @Prop({ required: true, unique: true })
   email: string;

   @Prop({ required: true })
   password: string;


   @Prop({
      type: [String], // Specify that it's an array of strings
      enum: Roles,
      default: [Roles.USER], // Set default as an array
   })
   role: Roles[]; // Keep it as an array of Roles
}   

export const UserSchema = SchemaFactory.createForClass(User);
