using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.Serializers;
using Newtonsoft.Json;
using System;
using MongoDB.Bson;
using System.Collections.Generic;

namespace video_editing_api.Model.Collection
{
    [CollectionName("Users")]
    public class AppUser : MongoIdentityUser<Guid>
    {
        public string FullName { get; set; }

        [BsonSerializer(typeof(RoleArraySerializer))]
        public string[] Role { get; set; }
    }

    public class RoleArraySerializer : SerializerBase<string[]>
    {
        public override string[] Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
        {
            var bsonReader = context.Reader;
            var serializer = BsonSerializer.LookupSerializer(typeof(string));
            if (bsonReader.CurrentBsonType == BsonType.Null)
            {
                bsonReader.ReadNull();
                return null;
            }
            else if (bsonReader.CurrentBsonType == BsonType.String)
            {
                var role = bsonReader.ReadString();
                return new string[] { role };
            }
            else if (bsonReader.CurrentBsonType == BsonType.Array)
            {
                var roles = new List<string>();
                bsonReader.ReadStartArray();
                while (bsonReader.ReadBsonType() != BsonType.EndOfDocument)
                {
                    var role = serializer.Deserialize(context);
                    roles.Add(role.ToString());

                }
                bsonReader.ReadEndArray();
                return roles.ToArray();
            }
            else
            {
                throw new BsonSerializationException("Unexpected BsonType: " + bsonReader.CurrentBsonType);
            }
        }

        public override void Serialize(BsonSerializationContext context, BsonSerializationArgs args, string[] value)
        {
            var bsonWriter = context.Writer;
            var serializer = BsonSerializer.LookupSerializer(typeof(string));
            if (value == null)
            {
                bsonWriter.WriteNull();
            }
            else if (value.Length == 1)
            {
                serializer.Serialize(context, value[0]);
            }
            else
            {
                bsonWriter.WriteStartArray();
                foreach (var role in value)
                {
                    serializer.Serialize(context, role);
                }
                bsonWriter.WriteEndArray();
            }
        }
    }

    // Đăng ký trình giải mã tùy chỉnh trong hệ thống
    public static class MongoDbInitializer
    {
        public static void Initialize()
        {
            BsonSerializer.RegisterSerializer(typeof(string[]), new RoleArraySerializer());
        }
    }
}

