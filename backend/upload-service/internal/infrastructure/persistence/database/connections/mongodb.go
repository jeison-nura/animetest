package connectionsMongo

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ConnectionMongo struct {
	Client *mongo.Client
	Db     *mongo.Database
}

func ConnectMongo(uri string, dbName string) (*ConnectionMongo, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	clientOptions := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, err
	}
	err = client.Ping(ctx, nil)
	if err != nil {
		return nil, err
	}
	db := client.Database(dbName)
	return &ConnectionMongo{
		Client: client,
		Db:     db,
	}, nil

}
