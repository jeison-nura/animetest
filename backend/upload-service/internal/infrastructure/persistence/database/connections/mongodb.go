package connectionsMongo

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type ConnectionMongo struct {
	Client *mongo.Client
	Db     *mongo.Database
}

func ConnectMongo(uri string, dbName string) (*ConnectionMongo, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	clientOptions := options.Client().ApplyURI(uri).SetConnectTimeout(5 * time.Second).SetServerSelectionTimeout(5 * time.Second).SetMaxPoolSize(100)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, err
	}
	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		return nil, err
	}
	db := client.Database(dbName)
	return &ConnectionMongo{
		Client: client,
		Db:     db,
	}, nil

}

func (c *ConnectionMongo) Disconnect(ctx context.Context) error {
	return c.Client.Disconnect(ctx)
}

func (c *ConnectionMongo) GetCollection(collectionName string) *mongo.Collection {
	return c.Db.Collection(collectionName)
}

func (c *ConnectionMongo) Ping(ctx context.Context) error {
	return c.Client.Ping(ctx, readpref.Primary())
}
