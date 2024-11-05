import { Column, DataType, Model, Table, Unique } from "sequelize-typescript";

@Table({
  tableName: "users",
  modelName: "User",
  timestamps: true,
})
class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id?: string;

  @Column({
    type: DataType.STRING,
  })
  declare username: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  declare phoneNo: string;

  @Column({
    type: DataType.STRING,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM("admin", "customer"),
    defaultValue: "customer",
  })
  declare role: string;

  @Column({
    type: DataType.STRING,
  })
  declare otp: string;
  @Column({
    type: DataType.STRING,
  })
  declare otpGeneratedTime: string;
}

export default User;
